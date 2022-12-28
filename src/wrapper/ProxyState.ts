import IComponent from "jsx/contracts/IComponent";

export class ProxyState implements Record<string, any> {
    invoke: any = {
        [Symbol.toPrimitive]: () => {
            return this.__data;
        }
    };

    [x: string]: any

    parent: IComponent;

    update: boolean = false;

    recall: boolean = false;

    constructor(public __data: any) { }
    
    [Symbol.toPrimitive]() {
        return this.invoke[Symbol.toPrimitive]();
    }
}

export default (data: unknown) => {
    return new Proxy(new ProxyState(data), {
        get(target, p: string) {
            if (!(p in target.invoke)) {
                target.invoke[p] =
                    typeof target.__data[p] === 'function'
                        ? (...args: any) => new Proxy(() => target.__data[p](...args), {
                            apply(fn) {
                                return fn();
                            },
                            set(_, p: string, newValue) {
                                target[p] = newValue;
                                return true;
                            },
                        })
                        : null;
            }
            return p in target ? target[p] : target.invoke[p] ?? target.__data[p];
        },
        set(target, p: string, value) {
            if (p in target) {
                target[p] = value;
            } else {
                target.invoke[p] = value;
            }
            return true;
        },
        getPrototypeOf() {
            return ProxyState.prototype;
        },
    })
}