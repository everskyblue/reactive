import { addParent } from "./add-parent";
import IComponentFragment from "./contracts/IComponentFragment";
import { IGeneral, IObjectGeneral } from "./contracts/IElement";
import { processElement } from "./factory";

export class ComponentFragment implements IComponentFragment {
    parent: any;
    id: number;

    constructor(public children: IGeneral[]) {
        if (children.some((child: any) => child instanceof ComponentFragment)) {
            throw new Error("no support fragment inside of fragment");
        }
        
        addParent(this, this.children);
    }

    resolveFragment(): IObjectGeneral[] {
        return this.children.map((component: IGeneral) => processElement(component) as IObjectGeneral);
    }
}
