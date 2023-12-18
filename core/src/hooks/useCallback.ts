import { TreeWidget } from "../TreeWidget";
import { HookStore } from "./hookStore";
import {createTicket, nextTicket} from './stackTicket'

HookStore.createStore("callbacks");

export function useCallback(callback: (...args: any[]) => any, ctx: TreeWidget<any>) {
    const callbacks = createTicket(ctx);
    
    if (callbacks.reInvoke) {
        return nextTicket(callbacks);
    }

    return callbacks.queue.push(callback), callback;
}
