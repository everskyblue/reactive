import { addParent } from "./add-parent";
import IComponentDOM from "./contracts/IComponentDOM";
import { IGeneral } from "./contracts/IElement";

export class ComponentDOM implements IComponentDOM {
    parent: any;
    id: number;
    constructor(
        public tagname: string,
        public attrs: Pick<string, any>,
        public children: IGeneral[]
    ) {
        addParent(this, this.children);
    }
}
