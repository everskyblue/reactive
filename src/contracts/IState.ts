import { IComponentGeneral } from "./IElement";

interface IState {
    data: any;
    $listener: any
    parent: IComponentGeneral;
    toString(): any;
}

export default IState;