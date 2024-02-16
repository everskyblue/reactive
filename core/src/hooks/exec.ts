import { id } from "../TreeNative";
import { useCallback } from "./useCallback";
import { hook } from "./hookStack";

const memoHook = hook('memo');

export function exec(callback: (...args: any[]) => any): typeof callback {
    const component = id.component;
    const fn = useCallback(callback);
    const memo = memoHook.stack(component.type);
    return (...args: any[]) => {
        if (!component.isReInvoke) {
            memo.map.set(fn, fn(...args));
        }
        return memo.map.get(fn);
    };
}
