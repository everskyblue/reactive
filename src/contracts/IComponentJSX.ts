import IComponent from "./IComponent";
import { CallbackComponent, IComponentGeneral, IGeneral, IObjectGeneral, ParamsJSX } from "./IElement";

interface IComponentJSX extends IComponent {
    readonly id: number;
    data: any;
    state: any;
    component: CallbackComponent
    params: ParamsJSX

    useEffect(): PromiseLike<any>
    existsUseEffect(): boolean
    invokeComponent(): IComponentGeneral | IComponentGeneral[]
}

export default IComponentJSX;