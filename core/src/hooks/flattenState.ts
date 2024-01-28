import type { TreeNative } from "../TreeNative";
import { IStackTicket, createTicket, nextTicket } from "./stackTicket";

export function flattenState<TypeData>(ctx: TreeNative<any>): IStackTicket | State & TypeData {
    const states = createTicket(ctx);

    if (states.reInvoke) {
        return nextTicket<State & TypeData>(states);
    }

    return states;
}
