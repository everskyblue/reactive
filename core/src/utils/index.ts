import { TreeWidget } from "src/TreeWidget";
import { ICallbackContext } from "../contracts";
import { exec } from "../hooks";
import { State } from "src/State";

export function createCallbackContext(ctx: TreeWidget<any>) {
    return {
        ctx,
    };
}

export function getCallbackContext(ctx: ICallbackContext) {
    return ctx.ctx;
}

export function implementStates(states: State[], ctx: ICallbackContext) {
    exec(() => {
        ctx.ctx.implementStates(...states);
    }, ctx.ctx)();
}
