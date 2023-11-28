import { TreeWidget } from "src/TreeWidget";
import { HookStore } from "./hookStore";
import { IStackTicket, createTicket, nextTicket } from "./stackTicket";
import { State } from "src/State";

HookStore.createStore("states");

export function flattenState<TypeData>(ctx: TreeWidget<any>): IStackTicket | State & TypeData {
    const states = createTicket(ctx);

    if (states.reInvoke) {
        return nextTicket<State & TypeData>(states);
    }

    return states;
}
