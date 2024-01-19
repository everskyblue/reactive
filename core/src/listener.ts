type fnEvent = (data: any, oldData: any) => any;

export class MapListeners extends Map implements Pick<string, any> {
    [key: string]: any;

    constructor() {
        super();
    }

    set(prop: any, listener: Listeners): this {
        super.set(prop, listener);
        if (!(prop in this)) {
            Object.defineProperty(this, prop, {
                set(newValue: any) {
                    for (const fn of listener.getQueue()) {
                        fn(newValue, listener.value);
                    }
                    listener.value = newValue;
                },
                get() {
                    return listener;
                },
            });
        }
        return this;
    }
}

export class Listeners implements Pick<string, any> {
    [key: string]: any;

    private stacks: fnEvent[] = [];

    constructor(public value: string) {}

    getQueue() {
        return this.stacks;
    }

    addListener(fn: fnEvent) {
        this.stacks.push(fn);
    }
}
