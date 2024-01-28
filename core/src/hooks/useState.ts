import { TreeWidget, id } from "../TreeWidget";
import { State, StateRender } from "../State";
import { flattenState } from "./flattenState";
import { NativeListener, SetNativeListener } from "../listener";
import { debounce } from "../utils";

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
        childs?: TreeWidget<T>
    ) => any;
};


function createStoreState(handler: HandlerListener) {
    const store = new Map<TreeNative, NativeListener<TreeNative>>();
    return (parent: TreeNative, state: State) => {
        if (state && state.superCtx && !store.has(parent)) {
            store.set(parent, new SetNativeListener([new NativeListener<TreeNative>('changeState', parent, state).addListener(handler)]));
        } /*else if (state && !state.currentStoreState.superCtx && Array.from(store.get(parent)).some(event => event.target === parent) === false) {
            store.get(parent).add(new NativeListener<TreeNative>('changeState', parent, state).addListener(handler));
        }*/ else if (!state) {
            return store.get(parent);
        } else if (store.has(parent) && state.superCtx) {
            store.get(parent).add(new NativeListener<TreeNative>('changeState', parent, state).addListener(handler));
        }
    }
}

export const listener = createStoreState((event) => {
    event.target.$update(event.data);
});

const debounceState = (()=> {
    let call: NativeListener<TreeNative>[];
    const caller = debounce(() => {
        const find = call;//calls.findLast(nl => nl.data.superCtx);
        call = null;
        if (find) find._invoke();
    }, 10);
    
    return (listListener: SetNativeListener, proxies: State) => {
        call = listListener._findIn('data', proxies);
        caller();
    }
})();

/**
 * llama a los metodos o propiedades de clase State y devuele su valor
 *
 * Call the State Class Methods or Properties and go out of its value
 */
function bind(target: State, key: string, component) {
    return (typeof target[key] === "function") ? target[key].bind(target) : target[key];
}

/**
 * retorna un proxy para manejar los valores de los datos y renderizado de la vista
 * el valor original de un objecto es devuelto
 * aun no esta implementado el renderizado se estado con Object
 * solo esta permitido: string, number, boolean, array
 * { use: true }
 * Returns a proxy to handle the data values and rendering of the view The original value of an object is returned
 * not yet implemented the rendering is with Object only this allowed: String, Number, Boolean, Array
 */
export function useState<TypeData = any, TypeWidget = any>(
    data?: TypeData,
    reInvokeCtx: TreeWidget<TypeWidget> | boolean = false
): TypeData & State {
    const component = id.component;
    const flatten = flattenState<TypeData>(component);
    if (flatten instanceof State) {
        return flatten as TypeData & State;
    }

    const proxies = new Proxy(new State(data, reInvokeCtx), {
        get(target, key: string) {
            if (key in target) {
                return key === 'set' && component ? (value: any) => (target.set(value), debounceState(listener(component), proxies)) : bind(target, key, component);
            } else if (typeof target.value[key] !== 'undefined') {
                // cuando es un estado que no se añade a la vista retorna el dato original pedido
                if (
                    !Array.isArray(target.value) &&
                    target.value instanceof Object //&& !target.parentNode
                ) {
                    return target.value[key];
                }

                /**
                 * si la data es una function, devuele una function
                 * para obtener sus nuevos valores
                 * sirve mas para Array.map que retorna una vista
                 *
                 * If the data is a function, returns a function to get new values.
                 * More suitable for Array.map that returns a view
                 */
                return typeof target.value[key] === "function"
                    ? (...args: any[]) => {
                        const newValue = target.value[key].apply(target.value, args);
                        if (typeof newValue !== 'undefined') {
                            return new StateRender(
                                target.value[key].apply(target.value, args),
                                proxies
                            );
                        }
                    }
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

    if (typeof flatten === 'object') 
        flatten.queue.push(proxies);
    listener(component, proxies);
    
    return proxies;
}

export function createState<Param extends object>(manager: Param): () => ReturnType<typeof useState> {
    const brig = {};

    const set = (key: string) => (v) => {
        brig[key].set(v);
    }

    const get = (key: string) => {
        let state: typeof useState;
        return () => {
            if (!state) {
                state = useState(manager[key]);
            }
            return state;
        }
    }

    for (let key in manager) {
        const defineProperty = typeof manager[key] === 'function' ? { value: manager[key].bind(brig) } : { get: get(key), set: set(key) };
        Object.defineProperty(brig, key, defineProperty);
    }

    let state: typeof useState;

    return () => {
        return state ?? (state = useState(brig));
    };
}
