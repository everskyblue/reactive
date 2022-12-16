import IComponent from "./IComponent";
import { IObjectGeneral } from "./IElement";

interface IComponentFragment extends Omit<IComponent, "state" | "jsxprocessor" | "props"> {
    /**
     * estructura de dom
     */
    resolveFragment(): IObjectGeneral[];
}

export default IComponentFragment;