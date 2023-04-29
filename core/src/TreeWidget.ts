import {
    IMapListeners,
    IState,
    IStoreState,
    IWidget,
    IWidgetUpdate,
    ReactiveCreateElement,
    ReactiveCreateElementOfType,
    TypeElement,
} from "./contracts";
import { Reactive } from "./reactive";
import { State } from "./State";
import { Listeners, MapListeners } from "./listener";

const storeProxy: Set<IState> = new Set();
const ALLOWED_TYPES = ["string", "number", "boolean"];

function toArray<TypeWidget = any>(
    data: TypeElement<TypeWidget> | TypeElement<TypeWidget>[]
) {
    return Array.isArray(data) ? data : [data];
}

function getNodeWidgetChild(ctx: ReactiveCreateElement<any>) {
    if (typeof ctx.type === "string") return toArray(ctx.node);
    return ctx.childs.map(recursive).flat();
}

function recursive(ctx: TreeWidget) {
    if (ctx.node) {
        return ctx.node;
    }
    return each(ctx).flat();
}

function reCreateElement<TypeWidget>(
    widget: ReactiveCreateElement<TypeWidget>
) {
    return Reactive.createElement(
        widget.type,
        widget.properties,
        ...reCreateElementChild(widget.childs)
    );
}

function reCreateElementChild(widgetChilds: TypeElement[]): TypeElement[] {
    return widgetChilds.map((child) => {
        console.log(child);

        if (child instanceof TreeWidget) {
            return reCreateElement(child);
        }
        return child;
    });
}

function each(ctx: TreeWidget) {
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

function getParent<TypeWidget = any>(
    ctx: ReactiveCreateElement<TypeWidget> | State
): ReactiveCreateElement<TypeWidget> | any {
    let parent = ctx;

    //@ts-ignore
    while (parent && typeof parent.node !== "object") {
        parent = parent.parentNode;
    }

    return parent;
}

function mergeProperties(withChild: boolean = false) {
    const props = {} as any;

    if (withChild) {
        props.children = this.originalChilds;
    }

    for (const key in this.properties) {
        const is = key === 'shareContext';
        if (withChild && is) {
            props["sharedContext"] = this.properties[key];
        } else {
            props[key] = this.properties[key];
        }
    }

    return props;
}

export class TreeWidget<TypeWidget = any>
    implements ReactiveCreateElement<TypeWidget>
{
    isReInvoke: boolean = false;
    sharedContext: IMapListeners = new MapListeners();

    node: TypeWidget = undefined;
    parentNode: ReactiveCreateElement<TypeWidget> = undefined;

    childs: TypeElement<TypeWidget>[] = undefined;

    constructor(
        public type: ReactiveCreateElementOfType<TypeWidget>,
        public properties: Record<string, any> & {
            shareContext?: { id: string | number; ref: any };
        },
        public widgedHelper: IWidget,
        public originalChilds: TypeElement<TypeWidget>[]
    ) {
        if (!properties) {
            this.properties = {} as any;
        }
        
        const shareContext = this.properties.shareContext;

        if (shareContext) {
            this.sharedContext.set(
                shareContext.id,
                new Listeners(shareContext.ref)
            );
        }

    }

    #throwerIfNotExecute<TypeWidget = any>(def: TypeElement<TypeWidget>) {
        if (def instanceof State) {
            if (!this.#isStringableState(def)) {
                throw new Error(
                    "the execution of a state without an executing function is only allowed if they are strings, numbers or boolean values"
                );
            }
        } /* else if (
            typeof def === "object" &&
            typeof def.type === "function" &&
            def.type.name !== Execute.name
        ) {
            throw new Error("is not a [function Execute] ");
        } */
    }

    #isStringableState(def: any) {
        if (Array.isArray(def.data)) {
            return (
                (def.data as any[]).some((data) => typeof data === "object") ===
                false
            );
        }
        return ALLOWED_TYPES.includes(typeof def.data);
    }

    #onUpdate(storeState?: IStoreState) {
        const ctxParentNode: ReactiveCreateElement<TypeWidget> =
            typeof this.type === "function" ? getParent(this) : this;
        const childs = ctxParentNode.childs;
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
            this.#throwerIfNotExecute(def);
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
            } else if (
                typeof def === "object" &&
                typeof def.type == "function"
            ) {
                def.type(def.properties) as unknown as State;
                updateInfo.state = storeState.rendering.map((def) =>
                    def.render().node
                );
                updateInfo.totalChilds = storeState.previousData.length;
                /* setTimeout(() => {
                    storeState.rendering = undefined;
                }, 0); */
            }

            this.widgedHelper.updateWidget(updateInfo);
        });
    }

    #onUpdateSuperCtx(superCtx: ReactiveCreateElement<TypeWidget>) {
        superCtx.isReInvoke = true;
        const { type } = superCtx;
        const newRender: ReactiveCreateElement<TypeWidget> = (
            type as Function
        ).call(superCtx, mergeProperties.call(superCtx, true));

        newRender.isReInvoke = true;
        newRender.render();
        const oldChilds = getNodeWidgetChild(superCtx);
        const nodes = getNodeWidgetChild(newRender);
        this.widgedHelper.replaceChild(
            this.getNodeWidget().node,
            nodes,
            oldChilds
        );
        newRender.parentNode = superCtx;
        superCtx.childs = toArray(newRender);
    }

    #renderChild() {
        const ctxWidget: ReactiveCreateElement<TypeWidget> =
            this.getNodeWidget();

        this.childs.forEach((child, index) => {
            const isState = child instanceof State;
            if (child instanceof TreeWidget) {
                child.parentNode = this;

                if (this.isReInvoke) {
                    child.isReInvoke = true;
                }

                if (this.sharedContext.size) {
                    if (!child.properties.sharedContext) {
                         child.properties.sharedContext = {};
                    }
                    this.sharedContext.forEach((ref, id) => {
                            child.sharedContext.set(id, ref);
                            child.properties.sharedContext[id] = ref;
                    });
                }

                if (ctxWidget && typeof child.node === "object") {
                    this.widgedHelper.appendWidget(ctxWidget.node, child.node);
                }

                child.render();
            } else {
                if (isState) {
                    if (
                        !storeProxy.has(child) &&
                        child.currentStoreState.superCtx
                    ) {
                        this.#rewriteMethod(child);
                    } else if (!child.currentStoreState.superCtx) {
                        this.#rewriteMethod(child);
                    }

                    if (ctxWidget) {
                        this.#renderDataState(this, ctxWidget.node, child);
                    }
                } else if (ctxWidget) {
                    this.widgedHelper.appendWidget(
                        ctxWidget.node,
                        this.widgedHelper.createText(child as any)
                    );
                }
            }
        });
    }

    #renderDataState<TypeWidget = any>(
        ctx: ReactiveCreateElement<TypeWidget>,
        parent: TypeWidget,
        state: State
    ) {
        const storeState = state.currentStoreState;
        if (
            Array.isArray(storeState.data) ||
            Array.isArray(storeState.rendering)
        ) {
            (storeState.rendering ?? storeState.data).forEach(
                (def: ReactiveCreateElement<TypeWidget>) => {
                    console.log(storeState,def);
                    
                    this.widgedHelper.appendWidget(
                        parent,
                        def instanceof TreeWidget ? def.render().node : def
                    );
                }
            );
        } else {
            this.widgedHelper.appendWidget(parent, state);
        }
    }

    #reRender(storeState: IStoreState) {
        return storeState.superCtx
            ? this.#onUpdateSuperCtx(storeState.superCtx)
            : this.#onUpdate(storeState);
    }

    render(): TreeWidget {
        if (this.node) {
            this.widgedHelper.setProperties(
                this.node,
                mergeProperties.call(this)
            );
            if (this.isReInvoke && this.widgedHelper.resetWidgets) {
                this.widgedHelper.resetWidgets(getNodeWidgetChild(this));
            }
        }

        if (typeof this.type === "function" && !this.childs) {
            const merge = mergeProperties.call(this, true);
            const child =
                this.type.name === "Fragment"
                    ? this.type(merge)
                    : this.type.call(this, merge);
            this.childs = toArray(child);
        }

        this.#renderChild();

        return this;
    }

    getNodeWidget(): ReactiveCreateElement<TypeWidget> {
        if (typeof this.node === "object") {
            return this;
        }
        return getParent(this);
    }

    getSharedContext(id: string) {
        return this.sharedContext.get(id);
    }

    #rewriteMethod(...states: IState[]) {
        for (const state of states) {
            const set = state.set.bind(state);
            const append = state.append.bind(state);

            state.set = (newValue: any) => {
                set(newValue);
                this.#reRender(state.currentStoreState);
            };

            state.append = (values: any[]) => {
                append(values);
                this.#reRender(state.currentStoreState);
            };
            storeProxy.add(state);
        }
    }

    implementStates(...states: IState[]) {
        this.#rewriteMethod(...states);
    }
}
