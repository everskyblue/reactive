import { CallbackComponent, ICreateElement, IElement, IGeneral } from "./IElement";

interface IComponent {
    id: number
    state: any[]
    parent: IComponent;
    resultNode: IElement;
    jsxprocessor: string | CallbackComponent
    props: Pick<string, any>
    children: IGeneral[]
    render(widget?: ICreateElement): IGeneral | IGeneral[];
}

export default IComponent;