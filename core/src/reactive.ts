import type {
    IWidget,
    IWidgetUpdate,
    ReactiveCreateElement,
    ReactiveCreateElementOfType,
    StoreState,
    TypeElement,
} from "./implements.d";
import { Execute } from "./useState";
import { State } from "./State";

let widgetCreate: IWidget;

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
    /**
     *
     * @param elements tree childs
     * @returns array TypeElement<TypeWidget>[]
     */
    static Fragment<TypeWidget = any>(
        elements: TypeElement<TypeWidget>[]
    ): TypeElement<TypeWidget>[] {
        return elements;
    }

    /**
     *
     * @param type type element
     * @param properties properties received
     * @param childs tree childs
     * @returns
     */
    static createElement<TypeWidget = any>(
        type: ReactiveCreateElementOfType<TypeWidget>,
        properties: Record<string, any>,
        ...childs: ReactiveCreateElement<TypeWidget>[]
    ): ReactiveCreateElement<TypeWidget> {
        const def = {
            type,
            properties,
            getParentNode,
            render: renderView,
        } as ReactiveCreateElement<TypeWidget>;

        setParent(childs);

        if (typeof type === "string") {
            def.node = widgetCreate.createWidget(type);
            def.childs = childs;
            widgetCreate.setProperties(def.node, properties);
        } else if (typeof type === "function") {
            const child =
                type.name === "Fragment"
                    ? type(childs)
                    : type.call(def, properties, childs);
            def.childs = child;
            setParent(Array.isArray(def.childs) ? def.childs : [def.childs]);
        }

        function setParent(childs: any[]) {
            childs.forEach((child) => {
                if (typeof child === "object") {
                    if (!child.parentNode) {
                        child.parentNode = def;
                    }
                }
            });
        }

        return def;
    }
}

function getParentNode() {
    if (typeof this.node === "object") {
        return this;
    }
    return getParent(this);
}

export function render<TypeWidget = any>(
    root: string,
    component: ReactiveCreateElement<TypeWidget>
) {
    component.node = widgetCreate.querySelector(root);
    component.render();
    console.log(component);

    return component;
}

function renderDataState<TypeWidget = any>(
    ctx: ReactiveCreateElement<TypeWidget>,
    parent: TypeWidget,
    state: State
) {
    const storeState = state.store.get(ctx);
    if (Array.isArray(storeState.data) || Array.isArray(storeState.rendering)) {
        (storeState.rendering ?? storeState.data).forEach(
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
    storeState?: StoreState
) {
    if (isUpdate) {
        const ctxParentNode: ReactiveCreateElement<TypeWidget> =
            typeof this.type === "function" ? getParent(this) : this;
        const childs = toArray(ctxParentNode.childs);
        const findAllIndex: number[] = [];

        // Find the matching indexes
        childs.forEach((child, index) => {
            if (
                this === child ||
                (child instanceof State && child.data === storeState.data)
            ) {
                findAllIndex.push(index);
            }
        });

        findAllIndex.forEach((findIndex) => {
            // get index
            const def = childs.at(findIndex);
            // Generate an error if the state does not have an enveloping function
            throwerIfNotExecute(def);
            // info update
            const updateInfo = {
                isStringable: false,
                node: ctxParentNode.node,
                typeAction: storeState.TYPE_ACTION,
                updateIndex: findIndex,
            } as IWidgetUpdate<TypeWidget>;

            if (def instanceof State) {
                updateInfo.isStringable = true;
                updateInfo.state = storeState.data;
                updateInfo.totalChilds = childs.length;
            } else if (typeof def.type == "function") {
                /*const mapState = */
                def.type(def.properties) as unknown as State;
                updateInfo.state = storeState.rendering.map((def) =>
                    def.render()
                );
                updateInfo.totalChilds = storeState.previousData.length;
                setTimeout(() => {
                    storeState.rendering = undefined;
                }, 0);
                /*const mapDataState = mapState.nwdata ?? mapState.data;
                 */
            }

            widgetCreate.updateWidget(updateInfo);
        });

        return;
    }

    (Array.isArray(this.childs) ? this.childs : [this.childs]).forEach(
        (child: ReactiveCreateElement<TypeWidget>) => {
            const isState = child instanceof State;

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

function throwerIfNotExecute<TypeWidget = any>(
    def: ReactiveCreateElement<TypeWidget>
) {
    if (def instanceof State) {
        if (!isStringableState(def)) {
            throw new Error(
                "the execution of a state without an executing function is only allowed if they are strings, numbers or boolean values"
            );
        }
    } else if (
        typeof def.type === "function" &&
        def.type.name !== Execute.name
    ) {
        throw new Error("is not a [function Execute] ");
    }
}

function isStringableState(def: any) {
    if (Array.isArray(def.data)) {
        return (
            (def.data as any[]).some((data) => typeof data === "object") ===
            false
        );
    }
    return ["string", "number", "boolean"].includes(typeof def.data);
}
