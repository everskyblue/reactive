import type { TreeNative } from "./TreeNative"

export type fnEvent = (data: any, oldData: any) => any;
export type HandlerListener<Target = any> = (target: EventTarget<Target>)=> any;

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

export class EventTarget<Target> {
    readonly timeStamp = Date.now();
    public constructor(readonly type: string, readonly target: Target, readonly data?: any) {}
}

export class NativeListener<Target> extends EventTarget<Target> {
    readonly $queue: HandlerListener<Target>[] = [];
    
    addListener(fn: (target: EventTarget<Target>)=> any) {
        return this.$queue.push(fn), this;
    }
    
    _invoke() {
        for (const fn of this.$queue) {
            fn(new EventTarget<Target>(this.type, this.target, this.data));
        }
    }
}

export class SetNativeListener<Target = any> extends Set<NativeListener<Target>>{
    _invokeAll(filter?: (event: EventTarget<Target>)=> boolean) {
        for (const listener of Array.from(this)) {
            listener._invoke();
        }
    }
    
    _findIn(key: string, to: any): NativeListener<Target> {
        return Array.from(this).find(nl => nl[key] === to);
    }
}
