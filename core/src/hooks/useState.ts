import { State } from "../State";
import { IState, ReactiveCreateElement } from "../contracts";
import { flattenState } from "./flattenState";

const mapState = new Map();

export type ExecuteReceivedProps<T = any> = {
    state?: State & T;
    /**
     * recibe cualquier valor
     *
     * receives any value
     */
    option?: any;
};

export type Executeprops<T = any> = ExecuteReceivedProps & {
    callback?: (
        properties: ExecuteReceivedProps,
        childs?: ReactiveCreateElement<T>
    ) => any;
};

/**
 * llama a los metodos o propiedades de clase State y devuele su valor
 *
 * Call the State Class Methods or Properties and go out of its value
 */
function bind(target: State, key: string) {
    if (typeof target[key] === "function") {
        return target[key].bind(target);
    }
    return target[key];
}

/**
 * retorna un proxy para manejar los valores de los datos y renderizado de la vista
 * el valor original de un objecto es devuelto
 * aun no esta implementado el renderizado se estado con Object
 * solo esta permitido: string, number, boolean, array
 *
 * Returns a proxy to handle the data values and rendering of the view The original value of an object is returned
 * not yet implemented the rendering is with Object only this allowed: String, Number, Boolean, Array
 */
export function useState<TypeData = any, TypeWidget = any>(
    data?: TypeData,
    reInvokeCtx?: ReactiveCreateElement<TypeWidget>
): TypeData & IState {
    const flatten = reInvokeCtx ? flattenState<TypeData>(reInvokeCtx) : undefined;
    
    if (flatten instanceof State) {
        return flatten as TypeData & IState;
    }

    if (mapState.has(reInvokeCtx) && reInvokeCtx.isReInvoke) {
        const store = mapState.get(reInvokeCtx);
        const state = store.states[store.current];
        store.current += 1;
        if (store.current === store.states.length) {
            store.current = 0;
        }
        return state;
    }

    const proxies = new Proxy(new State(data, reInvokeCtx), {
        get(target, key: string) {
            if (key in target) {
                return bind(target, key);
            } else if (key in target.data) {
                // cuando es un estado que no se añade a la vista retorna el dato original pedido
                if (
                    !Array.isArray(target.data) &&
                    target.data instanceof Object &&
                    !target.parentNode
                ) {
                    return target.data[key];
                }

                /**
                 * si la data es una function, devuele una function
                 * para obtener sus nuevos valores
                 * sirve mas para Array.map que retorna una vista
                 *
                 * If the data is a function, returns a function to get new values.
                 * More suitable for Array.map that returns a view
                 */
                return typeof target.data[key] === "function"
                    ? (...args: any[]) => (
                          target.$setReturnData(
                              target.data[key].apply(target.data, args)
                          ),
                          proxies
                      )
                    : proxies;
            } else {
                throw new Error("error proxy " + key);
            }
        },
        set(target, key, newValue) {
            if (key in target) {
                target[key] = newValue;
            } else if (key in target.data) {
                target.data[key] = newValue;
            } else {
                return false;
            }
            return true;
        },
    }) as TypeData & State;

    proxies.addProxySelf(proxies);

    if (typeof flatten === 'object') {
        flatten.queue.push(proxies);
    }

    return proxies;
}

/**
 * es una funcion envolvente para manejar la ejecucion de un estado
 * y volverlo a renderizar sin tener que llamarse a todo el componente
 *
 * Is an enveloping function to handle the execution of a state
 * And render it again without having to call the whole component
 */
export function Execute(
    props: Executeprops | null,
    childs: ReactiveCreateElement<any>
) {
    const { state, callback, option } = props ?? ({} as Executeprops);
    if (callback) return callback.call(this, { state, option }, childs);
    return childs;
}
