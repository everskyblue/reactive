import IComponent from "./IComponent";
import { IObjectGeneral } from "./IElement";

interface IComponentFragment extends IComponent {
    /**
     * estructura de dom
     */
    resolveFragment(): IObjectGeneral[];
}

export default IComponentFragment;