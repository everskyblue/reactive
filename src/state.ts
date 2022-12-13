import IComponentFragment from "./contracts/IComponentFragment";
import { IComponentGeneral } from "./contracts/IElement";
import IState from "./contracts/IState";
import { Listeners } from "./Listeners";
import render from "./render";
import AbstractComponent from "./wrapper/AbstractComponent";

export class State<T> implements IState {
    id: number = 0;

    #listener = new Listeners(State.nameEvent);

    #register_fn = new Map();

    private _parent: IComponentGeneral;

    constructor(data: T) {
        this.updateData(data);
    }

    toString = () => {
        if (this.#register_fn.size > 0) {
            this.#register_fn.values().next().value;
        }
        return this.$listener.value;
    };

    callMethodOfValue(nameFunc: string, params: any[]): any | any[] {
        return this.$listener.value[nameFunc](...params);
    }

    getContext = () => {
        return this;
    };

    updateData(value: T | T[]): Listeners {
        this.$listener.value = value;
        return this.$listener;
    }

    callMethods(name: string, proxy: Required<State<T>>) {
        if (name in this) {
            return this[name];
        }

        try {
            const data = this.data[name];
            if (typeof data === "function") {
                return (...args: any[]) => {
                    this.#register_fn.set(name, args);
                    this.#listener.value = this.callMethodOfValue(name, args);
                    return proxy;
                };
            }
            return data;
        } catch (error) {
            console.log("check error", error);
        }
    }

    get $listener(): Listeners {
        return this.#listener;
    }

    get getFn() {
        return this.#register_fn;
    }

    set parent(parent: IComponentGeneral) {
        this._parent = parent;
    }

    get parent(): IComponentGeneral {
        return this._parent;
    }

    public get value(): string {
        return this.toString();
    }

    public get data(): any {
        return this.$listener.value;
    }

    
    public get context() : State<T> {
        return this;
    }
    

    static get nameEvent(): string {
        return "value";
    }
}

export function useState<T>(
    data: T,
    context: IComponentGeneral
): [T, (data: T) => any] {
    const state: State<T> = new State<T>(data);
    const nwProxy = new Proxy(state, {
        get(target: State<T>, name: string, values: any) {
            return target.callMethods(name, proxy);
        },

        set(target, property: string, value) {
            if (!(property in target))
                throw new Error(`${property} does not exists`);
            target[property] = value;
            return true;
        },

        getPrototypeOf() {
            return State.prototype;
        },
    });
    //console.log(data, state, context,context.state?.at(state.id));
    
    const proxy = context.state ? (context.state.at(state.id + 1) ?? nwProxy) : nwProxy;

    //console.log(state, context.state?.length, context.state?.at(state.id + 1));
    if (!context.state) {
        context.state = [proxy];
    } else if (context.state && !context.state.includes(proxy)) {
        proxy.id = context.state.at(-1).id + 1;
        context.state.push(proxy);
    }

    state.$listener.onValue((data) => {
        console.log(data, state, render(context));
    });

    const value = context.state.at(-1) as T;
    console.log(value);
    
    function dispatcher(nwData: any) {
        state.updateData(nwData).invoke(nwData);
    }

    return [value, dispatcher];
}

export async function useEffect(fn: () => void) {
    fn();
}
