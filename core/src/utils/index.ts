import { TreeWidget, TypeChildNode } from "../TreeWidget";
import { ICallbackContext } from "../contracts";
import { exec, flattenState } from "../hooks";
import { State } from "../State";

export function implementStates(
    ...states: [states: State, ctx: TreeWidget<any>][] | State[]
) {
    for (const values of states) {
        const [state, ctx] = Array.isArray(values) ? values : [values];
        const tree = state.currentStoreState.superCtx ?? ctx;
        
        if (typeof tree === 'undefined') {
            throw new Error("el estado no tiene el contexto del componente");
        }

        exec(() => {
            if (ctx) {
                state.currentStoreState.superCtx = tree;
            }
            tree.implementStates(state);
        }, tree)();
    }
}

export function toArray<TypeWidget = any>(
    data: TypeChildNode | TypeChildNode[]
) {
    return Array.isArray(data) ? data : [data];
}

export function getNodeWidgetChild(ctx: TreeWidget<any>) {
    if (typeof ctx.type === "string") return toArray(ctx.node);
    return ctx.childs.map(recursive).flat();
}

export function recursive(ctx: TreeWidget) {
    if (ctx.node) {
        return ctx.node;
    }
    return each(ctx).flat();
}

export function each(ctx: TreeWidget) {
    const v = [];
    for (const child of ctx.childs) {
        let r = child;
        if (child instanceof TreeWidget) {
            r = recursive(child);
        }
        v.push(r);
    }
    return v;
}

export function getParent<TypeWidget = any>(
    ctx: TreeWidget<TypeWidget> | State
): TreeWidget<TypeWidget> | any {
    let parent = ctx;

    //@ts-ignore
    while (parent && typeof parent.node !== "object") {
        parent = parent.parentNode;
    }

    return parent;
}

export function mergeProperties(withChild: boolean = false) {
    const props = {} as any;

    if (withChild) {
        props.children = this.originalChilds;
    }

    for (const key in this.properties) {
        const is = key === "shareContext";
        if (withChild && is) {
            props["sharedContext"] = this.properties[key];
        } else {
            props[key === "className" ? "class" : key] = this.properties[key];
        }
    }

    return props;
}
