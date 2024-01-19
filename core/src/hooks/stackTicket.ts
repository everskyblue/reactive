import { TreeWidget } from "../TreeWidget";
import { HookStore } from "./hookStore";

HookStore.createStore("tickets");

export interface IStackTicket {
    ticket: number;
    queue: any[];
    reInvoke: boolean;
}

export function nextTicket<Type = any>(stack: IStackTicket): Type {
    const currentValue = stack.queue.at(stack.ticket);
    stack.ticket += 1;
    if (stack.queue.length === stack.ticket) {
        stack.ticket = 0;
    }
    return currentValue;
}

export function createTicket(ctx: TreeWidget<any>): IStackTicket {
    if (!HookStore.tickets.has(ctx)) {
        HookStore.tickets.set(ctx, {
            reInvoke: false,
            ticket: 0,
            queue: [],
        });
    }
    
    const ticket = HookStore.tickets.get(ctx);
    
    if (ctx.isReInvoke) {
        ticket.reInvoke = true;
    }
    
    return ticket;
}
