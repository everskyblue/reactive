import type { TreeNative } from "../TreeNative";

const store = new Map<string, Map<TreeNative<any>, any>>();

type Union<T extends IHook> = {
     [P in keyof T]: P extends 'createStore' ? (key: string)=> void : Map<any, any>
}

interface IHook {
    [x: string]: any;
    createStore(key: string): void
}

export const HookStore = {
    createStore(key: string) {
        if (!store.has(key)) {
            store.set(key, new Map());
            Object.defineProperty(HookStore, key, {
                get() {
                    return store.get(key);
                },
            });
        }
    },
} as Union<IHook>;


