import { ReactiveCreateElement } from "../contracts";
import { HookStore } from "./hookStore";

HookStore.createStore("tickets");

export interface IStackTicket {
    ticket: number;
    queue: any[];
}

export function nextTicket<Type = any>(stack: IStackTicket): Type {
    const currentValue = stack.queue.at(stack.ticket);
    stack.ticket += 1;
    if (stack.queue.length === stack.ticket) {
        stack.ticket = 0;
    }
    return currentValue;
}

export function createTicket(ctx: ReactiveCreateElement<any>): IStackTicket {
    if (!HookStore.tickets.has(ctx)) {
        HookStore.tickets.set(ctx, {
            ticket: 0,
            queue: [],
        });
    }
    return HookStore.tickets.get(ctx);
}
