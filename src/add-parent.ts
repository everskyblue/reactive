import IComponent from "./contracts/IComponent";
import { IComponentGeneral, IGeneral, IObjectGeneral } from "./contracts/IElement";
import { State } from "./state";
import { ComponentDOM } from "./wrapper/ComponentDOM";
import { ComponentFragment } from "./wrapper/ComponentFragment";
import { ComponentJSX } from "./wrapper/ComponentJSX";
import { ProxyState } from "./wrapper/ProxyState";
import RawComponent from "./wrapper/RawComponent";
import { ValueArray, ValueBoolean, ValueNumber, ValueObject, ValueString } from "./wrapper/ValueState";

export function addParent(parent: IComponentGeneral | any, children: IGeneral[]) {
    for (const index in children) {
        const element = children[index];
        
        if (element instanceof ComponentDOM 
            || element instanceof ComponentJSX 
            || element instanceof ComponentFragment 
            || element instanceof ProxyState
            || typeof element === 'function'
        ) {
            if ('parentCallbackComponent' in element && typeof element.parentCallbackComponent === 'undefined') {
                element.parentCallbackComponent = parent.parentCallbackComponent;
            }

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