import { TreeNative, TypeChildNode, _onUpdate } from "../TreeNative";
import type { State } from "../State";

/**
 * convierte en un array los elementos
 */
export function toArray<TypeWidget = any>(
    data: TypeChildNode | TypeChildNode[]
) {
    return Array.isArray(data) ? data : [data];
}

/**
 * obtiene el elemento, si es un componente obtiene el elemento del padre
 */
export function getNodeWidgetChild(ctx: TreeNative<any>) {
    if (typeof ctx.type === "string") return toArray(ctx.node);
    return ctx.childs.map(recursive).flat();
}

/**
 * busca el nodo de forma recursiva
 */
export function recursive(ctx: TreeNative) {
    if (ctx.node) {
        return ctx.node;
    }
    return each(ctx).flat();
}

/**
 * iterador de nodos hijosde forma recursiva
 */
export function each(ctx: TreeNative) {
    const v = [];
    for (const child of ctx.childs) {
        let r = child;
        if (child instanceof TreeNative) {
            r = recursive(child);
        }
        v.push(r);
    }
    return v;
}

/**
 * itera hasta encontrar el elemento padre
 */
export function getParent<TypeWidget = any>(
    ctx: TreeNative<TypeWidget> | State
): TreeNative<TypeWidget> | any {
    let parent = ctx;

    //@ts-ignore
    while (parent && typeof parent.node !== "object") {
        parent = parent.parentNode;
    }

    return parent;
}

/**
 * une propiedades y la normaliza
 */
export function mergeProperties(withChild: boolean = false) {
    const props = {} as any;

    if (withChild) {
        props.children = this.originalChilds;
    }

    for (const key in this.properties) {
        if (withChild && key === "shareContext") {
            props["sharedContext"] = this.properties[key];
        } else {
            props[key === "className" ? "class" : key] = this.properties[key];
        }
    }

    return props;
}

export function debounce(fn: Function, timer): ((...args: any[])=> any) {
    let timeout, params;
    
    function clear() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    }
    
    return function () {
        if (timeout) return;
        params = [this, arguments];
        timeout = setTimeout(function() {
            clear();
            const [ctx, args] = params;
            fn.apply(ctx, args);
        }, timer);
    }
}
