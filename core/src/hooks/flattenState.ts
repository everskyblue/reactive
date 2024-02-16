import type { TreeNative } from "../TreeNative";
import { IStackTicket, createTicket, nextTicket } from "./stackTicket";
import { hook } from "./hookStack";

const hookStates = hook("tickets");

export function flattenState<TypeData>(ctx: TreeNative<any>): IStackTicket | State & TypeData {
    const states = hookStates.stack(ctx.type);

    if (ctx.isReInvoke) {
        return ()=> hookStates.nextTicket<State & TypeData>(states);
    }

    return states;
}
