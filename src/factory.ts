import { getParent } from "./add-parent";
import { ComponentDOM } from "./ComponentDOM";
import { ComponentFragment } from "./ComponentFragment";
import { ComponentJSX } from "./ComponentJSX";
import IComponentDOM from "./contracts/IComponentDOM";
import IComponentJSX from "./contracts/IComponentJSX";
import {
    IComponentGeneral,
    ICreateElement,
    IElement,
    IGeneral,
    IObjectGeneral,
} from "./contracts/IElement";
import { Listeners } from "./Listeners";
import { State, rerun } from "./state";

let widget: ICreateElement;

function each(arr: IGeneral[], callback: (value: IGeneral, index: number)=>any) {
    for (let index = 0; index < arr.length; index++) {
        callback(arr[index], index);
    }
}

function iterateChild(childs: IGeneral[]) {
    each(childs, child => {
        if (Array.isArray(child)) {
            return iterateChild(child)
        }

        if (child instanceof State) {
            
        }
    })
}

export function setObjectCreateElement(create: ICreateElement) {
    widget = create;
}

function resolveProxyValue(value: IGeneral | IGeneral[]): IObjectGeneral | IObjectGeneral[] {
    if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index++) {
            value[index] = processElement(value[index]) as IObjectGeneral;
        }
    }
    return value as IObjectGeneral | IObjectGeneral[];
}

export function processElement(
    component: IGeneral | IGeneral[] | Required<State<any>>
): IObjectGeneral | IObjectGeneral[] {
    if (
        typeof component === "boolean" ||
        typeof component === "string" ||
        typeof component === "number"
    ) {
        return widget.createTextNode(component);
    }

    /*if (typeof component === 'function') {
        const [proxy, exec] = component();
        proxy.$listener.onValue((data: any)=> {
            exec()
        })
        proxy.parent = component.parent
        component = proxy;
    }
    console.log(component instanceof State, component);*/
    
    if (component instanceof State) {
        component.$listener.onValue((data: any) => {
            const parent: IComponentGeneral = (component as State<any>).parent as IComponentDOM;
            const nwResult: IObjectGeneral = processElement(parent) as IElement;
            const parentID = getParent(parent)
            widget.append(parent.tagname, parentID.id, nwResult);
        });
        return resolveProxyValue(component.toString());
    }
    if (component instanceof ComponentDOM) {
        return factoryDOM(component);
    } else if (component instanceof ComponentJSX) {
        return factoryComponent(component as IComponentJSX);
    } else if (component instanceof ComponentFragment) {
        return factoryFragment(component);
    }
    return component as IObjectGeneral;
}

export function factoryDOM(component: IComponentDOM): IElement {
    const e: IElement = widget.createElement(component.tagname);

    let parent = getParent(component);

    e.setAttribute("data-idx", parent.id.toString());

    for (const key in component.attrs) {
        const valueProp = component.attrs[key];
        if (/^on[A-Z]/.test(key)) {
            e.addEventListener(
                key.slice(2).toLowerCase(),
                valueProp as () => void
            );
        } else {
            e.setAttribute(key, valueProp);
        }
    }

    for (const child of component.children) {
        const node = processElement(child) as unknown as IElement;
        (Array.isArray(node) ? e.append(...node) : e.append(node));
    }

    return e;
}

export function factoryComponent(
    component: IComponentJSX
): IObjectGeneral | IObjectGeneral[] {
    return processElement(component.invokeComponent());
}

export function factoryFragment(
    component: ComponentFragment
): IObjectGeneral[] {
    return component.resolveFragment();
}

export function factory(
    component: IComponentGeneral | IComponentGeneral[]
): IObjectGeneral | IObjectGeneral[] {
    return processElement(component);
}
