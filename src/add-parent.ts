import IComponent from "./contracts/IComponent";
import { IComponentGeneral, IGeneral } from "./contracts/IElement";
import { ComponentDOM } from "./wrapper/ComponentDOM";
import { ComponentFragment } from "./wrapper/ComponentFragment";
import { ComponentJSX } from "./wrapper/ComponentJSX";
import RawComponent from "./wrapper/RawComponent";
import { ValueArray, ValueBoolean, ValueNumber, ValueObject, ValueString } from "./wrapper/ValueState";

export function addParent(parent: IComponentGeneral | any, children: IGeneral[]) {
    for (const index in children) {
        const element = children[index];
        
        if (element instanceof ComponentDOM 
            || element instanceof ComponentJSX 
            || element instanceof ComponentFragment 
            || element instanceof RawComponent
        ) {
            if ('parentCallbackComponent' in element && typeof element.parentCallbackComponent === 'undefined') {
                element.parentCallbackComponent = parent.parentCallbackComponent;
            }
            element.parent = parent;
        }
        if (typeof element === 'object' || typeof element === 'function') {
            //@ts-ignore
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