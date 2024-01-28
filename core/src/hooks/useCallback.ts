import { id } from "../TreeNative";
import {createTicket, nextTicket} from "./stackTicket";

export function useCallback(callback: (...args: any[]) => any) {
    const callbacks = createTicket(id.component);
    
    if (callbacks.reInvoke) {
        return nextTicket(callbacks);
    }

    return callbacks.queue.push(callback), callback;
}