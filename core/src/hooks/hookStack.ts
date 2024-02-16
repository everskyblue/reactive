import type { TreeNative } from "../TreeNative";
import stack from "./stackTicket";

interface IHook {
    [x: string]: ReturnType<typeof stack>;
}

const hookStack = {} as IHook;

export function hook(key: string) {
    if (key in hookStack) return hookStack[key];
    
    Object.defineProperty(hookStack, key, {
        value: stack(),
        writable: false,
        configurable: false
    })
    
    return hookStack[key];
}
