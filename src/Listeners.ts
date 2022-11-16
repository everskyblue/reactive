import { DListeners } from "./contracts";
import "string-tocapitalize";

export class Listeners implements DListeners, Record<string, any> {
    stores: Function[] = [];
    events: any = {};

    [x: string]: any;

    constructor(type: string) {
        if (!(type in this.events)) {
            const name = "on" + type.toCapitalize();
            const getter = { get: () => this.addListener };
            Object.defineProperty(this.events, name, getter);
            Object.defineProperty<Listeners>(this, name, getter);
            Object.defineProperty<Listeners>(
                this,
                type,
                this.#createDefProps()
            );
        }
    }
    #createDefProps() {
        let dd: any;

        return {
            get() {
                return dd;
            },

            set(v: any) {
                dd = v;
            },
        };
    }

    #callFunctions(val: any) {
        this.stores.map((fn) => {
            fn(val);
        });
    }

    invoke(val: any) {
        this.#callFunctions(val);
    }

    addListener = (fn: (value: string) => void)=> {
        this.stores.push(fn);
        return this;
    }
}
