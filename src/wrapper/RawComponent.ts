import IComponent from "jsx/contracts/IComponent";
import { CallbackComponent, ICreateElement } from "jsx/contracts/IElement";

export default class RawComponent
    implements
        Omit<
            IComponent,
            "state" | "resultNode" | "jsxprocessor" | "props" | "children"
        >
{
    id: number;
    parent: IComponent;
    parentCallbackComponent: IComponent

    constructor(public data: unknown) {}

    render() {
        return this.data;
    }

    toString() {
        return this.data.toString();
    }
}
