import IComponent from "./contracts/IComponent";
import { IComponentGeneral, IGeneral } from "./contracts/IElement";

export function addParent(parent: IComponent, children: IGeneral[]) {
    for (const index in children) {
        const element = children[index];
        if (typeof element === 'object' || typeof element === 'function') {
            //@ts-ignore
            element.parent = parent;
        }
    }
}

export function getParent(component: IComponentGeneral): IComponent {
    let parent = component.parent;

    while (typeof parent.id !== 'number') {
        parent = parent.parent;
    }

    return parent;
}