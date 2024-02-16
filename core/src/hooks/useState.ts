import { TreeNative, id } from "../TreeNative";
import { flattenState } from "./flattenState";
import { NativeListener, SetNativeListener } from "../listener";
import { debounce } from "../utils";
import State from "../state/InfoState";
import createProxy from "../state/briget";
import { hook } from "./hookStack";
import debounceState from "./debounceState";
import briget from "../state/briget";

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
        childs?: TreeNative<T>
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

const hookSG = hook('global-state');

const createInfoDesk = (
    component: TreeNative,
    scopeState: State.Scope,
    data: any,
    reinvoke: boolean,
) => (
    new State.InformationDesk(
        component,
        scopeState,
        new State.Value(data, reinvoke),
        reinvoke
    )
);

const getProxy = (
    infoState: State.InformationDesk,
    handlerStateValue?: (handlerParam: { debounce: typeof debounceState, infoState: State.InformationDesk, proxy: State.Value }) => any
) => {
    return {
        info: infoState,
        proxy: createProxy(infoState.state, (debounce, proxy) => {
            // handler
            return (newValue: any) => {
                infoState.state.set(newValue);
                if (handlerStateValue) handlerStateValue({ debounce, infoState, proxy });
                else debounce(infoState, proxy);
            }
        })
    }
}

const newState = (
    component: TreeNative,
    scopeState: State.Scope,
    data: any,
    reinvoke: boolean,
    stack?: ReturnType<typeof hook>
) => {
    const { proxy } = getProxy(createInfoDesk(component, scopeState, data, reinvoke));

    if (stack) {
        stack.queue.add(proxy);
    }

    return proxy;
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
    reInvokeCtx: TreeNative<TypeWidget> | boolean = false
): TypeData & State {
    const component = id.component;
    const flatten = flattenState<TypeData>(component);

    if (typeof flatten === 'function') {
        return flatten() as TypeData & State;
    }

    return newState(component, State.Scope.LOCAL, data, reInvokeCtx, flatten);
}

export function createState<Param extends object>(manager: Param): (reInvokeCtx: boolean) => ReturnType<typeof newState> {
    const $manager = Object.create(null);
    const $update = new Set();
    const $updateSuper = new Map();
    let superManager = {};
    let state;
    const $keys = Object.keys(manager);
    let resolveParentState: State.Value[] = [];
    for (const key of $keys) {
        const isFn = typeof manager[key] === 'function';
        
        if (!isFn) {
            let $value: any = manager[key];
            Object.defineProperty($manager, key, {
                get: ()=> $value,
                set: (value: any)=> {
                    $value = value;
                    state[key] = $value;
                }
            })
        } else {
            $manager[key] = manager[key].bind($manager);
        }
        
        Object.defineProperty(
            superManager,
            key,
            isFn
                ? {
                    value: (...args: any[]) => {
                        $manager[key].apply($manager, args);
                    }
                }
                : {
                    get: (()=> {
                        const p = briget(new State.Value($manager[key]), false)
                        return ()=> p;
                    })(),
                    set: (value: any)=> {
                        superManager[key].set(value)
                        $update.add(superManager[key])
                    },
                }
        )
    }
    
    const stateValue = new State.Value(superManager, false);
    state = briget(stateValue, (debounce, proxy)=>{
        return ({component, invokeCtx, $proxy}) => {
            const all = $updateSuper.get(state);
            //console.log(Array.from(all.values()), all.get($proxy),component);
            all.clear()
            if (invokeCtx) {
                debounce(
                    new State.InformationDesk(
                        component,
                        State.Scope.GLOBAL,
                        stateValue,
                        invokeCtx
                    ),
                    proxy
                )
            } else {
                for (const localState of Array.from($update)) {
                    debounce(
                        new State.InformationDesk(
                            component,
                            State.Scope.GLOBAL,
                            localState,
                            invokeCtx
                        ),
                        localState
                    )
                }
                $update.clear();
            }
        }
    });
    
    $updateSuper.set(state, new Map());
    let currentComponent;
    return (invokeCtx: boolean = true, componentsUseState?: Function[]) => {
        const component = id.component;
        /*if (currentComponent !== component) {
            $updateSuper.get(state).set(component.type, [component,invokeCtx]);
            currentComponent = component;
        }
        */
        const $proxy = new Proxy(manager, {
            get(target, key) {
                if (typeof manager[key] === 'function') {
                    return (...args: any[]) => {
                        superManager[key](...args);
                        state.set({
                            component,
                            invokeCtx,
                            $proxy,
                            filter: componentsUseState
                        })
                    }
                }
                return superManager[key];
            }
        })
        
        //$updateSuper.get(state).set(component.type, [component, invokeCtx])
        
        return $proxy;
    };
}