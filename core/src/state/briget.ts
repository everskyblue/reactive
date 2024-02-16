import State from "./InfoState";
import type { TreeNative } from "../TreeNative";
import debounceState from "./debounceState";

export type HanlderSetState = (debounce: debounceState, proxy: State.Value)=> (fnSetState: (newValue: any) => any) => any;

/**
 * llama a los metodos o propiedades de clase State y devuele su valor
 *
 * Call the State Class Methods or Properties and go out of its value
 */
function bind(target: State.Value, key: string) {
    return (typeof target[key] === "function") ? target[key].bind(target) : target[key];
}

const brigGet = (handler?: HanlderSetState)=> function (target: State.Value, key: string, proxies) {
    if (key in target) {
        if (key === 'set' && handler) {
            return handler(debounceState, proxies);
        }
        return bind(target, key);
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
                    return new State.SubRender(
                        target.value[key].apply(target.value, args),
                        proxies
                    );
                }
            }
            : proxies;
    } else {
        console.error("error proxy " + key);
    }
}

const brigSet = (target: State.Value, key: string, newValue: any) => {
    if (key in target) {
        target[key] = newValue;
    } else if (key in target.value) {
        target.value[key] = newValue;
    } else {
        return false;
    }
    return true;
}

const createBriget = <TypeData>(stateValue: State.Value, handler?: HanlderSetState) => {
    return new Proxy(stateValue, {
        get: brigGet(handler),
        set: brigSet,
    }) as TypeData & State.Value;
}

export default createBriget;