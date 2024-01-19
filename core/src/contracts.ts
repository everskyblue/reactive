import { StateRender } from "./State";
import { TreeWidget } from "./TreeWidget";

export type TextWidget = { text: any } & Record<string, any>;

export interface IMapListeners extends Map<any, any>, Pick<string, any> {
    [key: string]: any;
}

export interface ICallbackContext {
    ctx: TreeWidget<any>;
}