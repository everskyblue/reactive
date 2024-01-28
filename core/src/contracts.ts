import type { StateRender } from "./State";
import type { TreeNative } from "./TreeNative";

export type TextWidget = { text: any } & Record<string, any>;

export interface IMapListeners extends Map<any, any>, Pick<string, any> {
    [key: string]: any;
}

export interface ICallbackContext {
    ctx: TreeNative<any>;
}