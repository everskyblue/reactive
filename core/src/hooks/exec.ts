import { ReactiveCreateElement } from "../contracts";
import { useCallback } from "./useCallback";
import { HookStore } from "./hookStore";

HookStore.createStore("memo");

export function exec(callback: (...args: any[]) => any, ctx: ReactiveCreateElement<any>): typeof callback {
    const memo = useCallback(callback, ctx);
    if (!HookStore.memo.has(memo)) {
        HookStore.memo.set(memo, false);
    }

    return (...args: any[]) => {
        if (HookStore.memo.get(memo) === false) {
            HookStore.memo.set(memo, memo(...args));
        }
        return HookStore.memo.get(memo);
    };
}