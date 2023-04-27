import { IState, ReactiveCreateElement } from "../contracts";
import { HookStore } from "./hookStore";
import { IStackTicket, createTicket, nextTicket } from "./stackTicket";

HookStore.createStore("states");

export function flattenState<TypeData>(ctx: ReactiveCreateElement<any>): IStackTicket | IState & TypeData {
    const states = createTicket(ctx);

    if (ctx.isReInvoke) {
        return nextTicket<IState & TypeData>(states);
    }

    return states;
}
