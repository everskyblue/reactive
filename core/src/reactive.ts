import {
    IWidget,
    ReactiveCreateElement,
    ReactiveCreateElementOfType,
    TypeElement,
} from "./implements";
import { Execute } from "./useState";
import { State } from "./State";

// Exclude<TypeElement<TypeWidget>, boolean | number>

let widgetCreate: IWidget;

const types = ["string", "boolean", "number", "object"];

function toArray<TypeWidget = any>(
    data:
        | ReactiveCreateElement<TypeWidget>
        | ReactiveCreateElement<TypeWidget>[]
) {
    return Array.isArray(data) ? data : [data];
}

export function addWidget(widget: IWidget) {
    widgetCreate = widget;
}

export class Reactive {
    static Fragment<TypeWidget = any>(
        elements: TypeElement<TypeWidget>[]
    ): TypeElement<TypeWidget>[] {
        return elements;
    }

    static createElement<TypeWidget = any>(
        type: ReactiveCreateElementOfType<TypeWidget>,
        properties: Record<string, any>,
        ...childs: ReactiveCreateElement<TypeWidget>[]
    ): ReactiveCreateElement<TypeWidget> {
        const def = {
            type,
            properties,
            onUpdateState,
            render: renderView,
        } as ReactiveCreateElement<TypeWidget>;

        if (typeof type === "string") {
            def.node = widgetCreate.createWidget(type);
            def.childs = childs;
            widgetCreate.setProperties(def.node, properties);
            def.childs.forEach((child) => {
                if (typeof child === "object" /*&& !child.parentNode*/) {
                    setParent(child);
                }
            });
        } else if (typeof type === "function") {
            const child =
                type.name === "Fragment"
                    ? type(childs)
                    : type.call(def, properties, childs);
            if (Array.isArray(child)) child.forEach(setParent);
            else setParent(child);
            def.childs = child;
        }

        function setParent(child: ReactiveCreateElement<TypeWidget>) {
            child.parentNode = def; //.node ?? def.type;
        }

        return def;
    }
}

function onUpdateState(state: any) {
    return () => {
        //
    };
}

export function render<TypeWidget = any>(
    root: string,
    component: ReactiveCreateElement<TypeWidget>
) {
    console.log(component);
    component.node = widgetCreate.querySelector(root);
    component.render();
    return component;
}

function renderDataState<TypeWidget = any>(
    ctx: ReactiveCreateElement<TypeWidget>,
    parent: TypeWidget,
    state: State
) {
    const cloneState = state.mapParentNode.get(ctx);
    //console.log(cloneState);
    if (Array.isArray(cloneState.nwdata) || Array.isArray(cloneState.data)) {
        (cloneState.nwdata ?? cloneState.data).forEach(
            (def: ReactiveCreateElement<TypeWidget>) => {
                widgetCreate.appendWidget(parent, def?.render() ?? def);
            }
        );
    } else {
        widgetCreate.appendWidget(parent, state);
    }
}

/** @this ReactiveCreateElement<TypeWidget> */
function renderView<TypeWidget = any>(
    isUpdate?: boolean,
    state?: State,
    oldDataState?: any
) {
    //console.log(this);

    if (isUpdate) {
        if (!state.parentNode) {
            state.parentNode = state.currentParentNode;
        }

        const p: ReactiveCreateElement<TypeWidget> =
            typeof this.type === "function" ? getParent(this) : this;
        const childs = toArray(p.childs);
        const findAllIndex: number[] = [];

        childs.forEach((child, index) => {
            if (
                this === child ||
                (child instanceof State && child.oldData === oldDataState)
            ) {
                findAllIndex.push(index)
            }
        });

        findAllIndex.forEach(findIndex => {
            const def = childs.at(findIndex);
            throwerIfNotExecute(def);
            
            if (def instanceof State) {
                widgetCreate.updateWidget(
                    true,
                    p.node,
                    state,
                    findIndex,
                    childs.length
                );
            } else if (typeof def.type == 'function') {
                const mapState = def.type(def.properties) as unknown as State;
                const mapDataState = mapState.nwdata??mapState.data;
                widgetCreate.updateWidget(
                    false,
                    p.node,
                    mapDataState.map((def) => def.render()),
                    findIndex,
                    oldDataState.length
                );
            }
            //console.log(findIndex, state)
        });

        return;
    }

    (Array.isArray(this.childs) ? this.childs : [this.childs]).forEach(
        (child: ReactiveCreateElement<TypeWidget>) => {
            const isState = child instanceof State;

            if (isState) {
                child.addListener(this, this.onUpdateState(state));
            }

            if (typeof child === "object" && !isState) {
                const { node } = getParent<TypeWidget>(child);
                if (typeof child.node === "object") {
                    widgetCreate.appendWidget(node, child.node);
                }
                child.render();
            } else {
                const parent = this.node ?? getParent<TypeWidget>(this).node;
                if (isState) {
                    renderDataState(this, parent, child);
                } else {
                    widgetCreate.appendWidget(parent, child);
                }
            }
        }
    );

    return this.node ?? this;
}

function getParent<TypeWidget = any>(
    ctx: ReactiveCreateElement<TypeWidget> | State
): ReactiveCreateElement<TypeWidget> | any {
    let parent = ctx.parentNode;

    if (typeof parent === "undefined") {
        return ctx;
    }

    while (typeof parent.node !== "object") {
        parent = parent.parentNode;
    }

    return parent;
}

function throwerIfNotExecute<TypeWidget = any>(def: ReactiveCreateElement<TypeWidget>) {
    if (def instanceof State) {
        if (!isStringableState(def)) {
            throw new Error(
                "the execution of a state without an executing function is only allowed if they are strings, numbers or boolean values"
            );
        }
    } else if (typeof def.type === 'function' && def.type.name !== Execute.name) {
        throw new Error("is not a [function Execute] ");
    }
}

function isStringableState(def: any) {
    const data = def.data;
    if (Array.isArray(def.data)) {
        return (def.data as any[]).some(data => typeof data === "object") === false;
    }
    return ['string', 'number', 'boolean'].includes(typeof def.data);
}