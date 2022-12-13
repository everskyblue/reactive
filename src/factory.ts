import { getParent } from "./add-parent";
import { ComponentDOM } from "./wrapper/ComponentDOM";
import { ComponentFragment } from "./wrapper/ComponentFragment";
import { ComponentJSX } from "./wrapper/ComponentJSX";
import IComponentDOM from "./contracts/IComponentDOM";
import IComponentJSX from "./contracts/IComponentJSX";
import {
    IComponentGeneral,
    ICreateElement,
    IElement,
    IGeneral,
    IObjectGeneral,
} from "./contracts/IElement";
import IState from "./contracts/IState";
import { Listeners } from "./Listeners";
import { State, rerun } from "./state";
import IComponent from "./contracts/IComponent";
import IComponentFragment from "./contracts/IComponentFragment";
import render from "./render";

let widget: ICreateElement;
const storeState = new Set<IState>();

function each(arr: IGeneral[], callback: (value: IGeneral, index: number)=>any) {
    for (let index = 0; index < arr.length; index++) {
        callback(arr[index], index);
    }
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
        console.log(component);
        if (!storeState.has(component)) {
            storeState.add(component);
            
            component.$listener.onValue((data: any) => {
                //const parent: IComponentGeneral = (component as State<any>).parent as IComponentDOM;
                //const nwResult: IObjectGeneral = processElement(parent) as IElement;
                console.log(data, component.getFn);
                for (const namefn of component.getFn.keys()) {
                    const args = component.getFn.get(namefn);
                    console.log(args, namefn, component.callMethodOfValue(namefn, args));
                    
                }
                
            })
        }
        /*component.$listener.onValue((data: any) => {
            const parent: IComponentGeneral = (component as State<any>).parent as IComponentDOM;
            const nwResult: IObjectGeneral = processElement(parent) as IElement;
            const parentID = getParent(parent)
            widget.append(parent.tagname, parentID.id, nwResult);
        });*/
        return component.toString();
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
    
    each(component.children, (child, index) => {
        const dom = processElement(child);
        if (Array.isArray(dom)) {
            each(dom, (jsxprocessor, index) => {
                const dom = processElement(jsxprocessor);
                e.append(dom as any);
            })
        } else {
            component.resultNode = dom as IElement;
            e.append(dom as any);
        }
    })

    /*for (const child of component.children) {
        const node = processElement(child) as unknown as IElement;
        (Array.isArray(node) ? e.append(...node) : e.append(node));
    }*/

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
    return render(component, widget) as any;
}
