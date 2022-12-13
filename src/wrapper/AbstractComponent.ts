import { addParent } from "jsx/add-parent";
import IComponent from "jsx/contracts/IComponent";
import { CallbackComponent, ICreateElement, IGeneral } from "jsx/contracts/IElement";
import IState from "jsx/contracts/IState";

let id = 0;

abstract class AbstractComponent implements IComponent {
    resultNode: HTMLElement;
    parent: IComponent;
    id: number;
    state: any[]

    constructor(public jsxprocessor: string | CallbackComponent, public props: Pick<string, any>, public children: IGeneral[]) {
        addParent(this, this.children);
    }

    abstract render(widget?: ICreateElement): IGeneral | IGeneral[];
}

export default AbstractComponent;