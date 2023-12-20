import { TreeWidget, TypeChildNode } from "../TreeWidget";
import { exec, flattenState } from "../hooks";
import { State } from "../State";

/**
 * añade al estado que se esta volviendo a invocar desde el contexto llamado
 * @param state State
 */
export function setReInvocationState(state: any) {
    let flatten = state.flatten;
    if (state.currentStoreState.superCtx && !flatten) {
        flatten = flattenState<any>(
            state.currentStoreState.superCtx
        );
    }

    if (flatten && !(flatten instanceof State)) flatten.reInvoke = true;
}

/**
 * reescribe el metodo set y append del estado
 * sirve para actualizar el elemento en el que se a añadido
 */
export function rewriteMethodState(states: State[], callback: (state: State) => void = () => {}) {
    for (const state of states) {console.log(state);
        const set = state.set.bind(state);
        const append = state.append.bind(state);

        state.set = (newValue: any) => {
            setReInvocationState(state);
            set(newValue);
            callback(state);
        };

        state.append = (values: any[]) => {
            setReInvocationState(state);
            append(values);
            callback(state);
        };
    }
}

/**
 * añade un estado global al contexto del componente para su actualizacion
 */
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
export function getNodeWidgetChild(ctx: TreeWidget<any>) {
    if (typeof ctx.type === "string") return toArray(ctx.node);
    return ctx.childs.map(recursive).flat();
}

/**
 * busca el nodo de forma recursiva
 */
export function recursive(ctx: TreeWidget) {
    if (ctx.node) {
        return ctx.node;
    }
    return each(ctx).flat();
}

/**
 * iterador de nodos hijosde forma recursiva
 */
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

/**
 * itera hasta encontrar el elemento padre
 */
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
