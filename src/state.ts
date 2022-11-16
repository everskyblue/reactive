import { IComponentGeneral } from "./contracts/IElement";
import { Listeners } from "./Listeners";


rerun.parent = null;
/**
 * @memberof State
 * @param nameFunc 
 * @param params 
 * @param proxy 
 * @returns 
 */
export function rerun<T extends object>(nameFunc: string, params: any[], proxy: T): [ProxyHandler<T>, ()=> any] {
    return [proxy, ()=> {
        const nwVal = this.$listener.value[nameFunc](...params);
        //this.$listener.value = nwVal; 
        console.log(nwVal);
        
        return nwVal;
    }];
}

export class State<T> {
    #listener = new Listeners(State.nameEvent);

    private _parent: IComponentGeneral;

    set parent(parent: IComponentGeneral)  {
        this._parent = parent;
    }

    get parent(): IComponentGeneral {
        return this._parent;
    }

    public get data(): any {
        return this.#listener.value;
    }

    callMethodOfValue(nameFunc: string, params: any[]): any | any[] {
        return this.#listener.value[nameFunc](...params);
    }

    getContext = () => {
        return this;
    };

    constructor(data: T) {
        this.updateData(data);
    }

    updateData(value: T | T[]): Listeners {
        this.#listener.value = value;
        return this.#listener;
    }

    callMethods(name: string, proxy: Required<State<T>>) {
        //console.log(name);
        
        try {
            if (name === "value") return this.#listener.value;
            if (name === "getContext") return this.getContext;
            if (name === "parent") return this.parent;
            if (name === "$listener") return this.#listener;
            if (name === "toString") return () => this.#listener.value;
            if (typeof this.data[name] === "function")
                return (...args: any[]) => {
                    const result = this.callMethodOfValue(name, args);
                    
                    if (typeof result !== "undefined") {
                        this.updateData(result);
                    }
                    return proxy
                    return <T>rerun.bind(this, name, args, proxy);
                };
        } catch (error) {
            console.error(error);
        }
        return this.data[name];
    }

    get $listener(): Listeners {
        return this.#listener;
    }

    static get nameEvent(): string {
        return "value";
    }
}

export function useState<T>(data: T): [T, (data: T) => any] {
    const state = new State<T>(data);
    const proxy = new Proxy(state, {
        get(target: State<T>, name: string, values: any) {
            //@ts-ignore if (Symbol.toPrimitive === name)
            //console.log(name, arguments);

            return target.callMethods(name, proxy);
        },

        set(target: State<T>, name: string, component: IComponentGeneral) {
            if (name === "parent") {
                state.parent = component;
            }
            return this;
        },

        getPrototypeOf() {
            return State.prototype;
        },
    });

    state.$listener.onValue(data => {
        console.log(data, state.$listener);
    })

    return [
        proxy as T,
        function dispatcher(nwData: any) {
            state.updateData(nwData).invoke(nwData);
        },
    ];
}

export async function useEffect(fn: () => void) {
    fn();
}
