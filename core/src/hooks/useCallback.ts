import { id } from "../TreeNative";
import { hook } from "./hookStack";

const callableHook = hook('callback');

export function useCallback(callback: (...args: any[]) => any) {
    const ticket = callableHook.stack(id.component.type);
    return id.component.isReInvoke
        ? callableHook.nextTicket(ticket)
        : (ticket.queue.add(callback), callback);
}