import IComponent from "./IComponent";
import { IGeneral } from "./IElement";

interface IComponentDOM extends IComponent {
    tagname: string
    attrs: Record<string, any>,
    children: IGeneral[]
}

export default IComponentDOM;