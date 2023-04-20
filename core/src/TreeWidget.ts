import {
    IState,
    IStoreState,
    IWidget,
    IWidgetUpdate,
    ReactiveCreateElement,
    ReactiveCreateElementOfType,
    TypeElement,
} from "./contracts";
import { State } from "./State";
import { Execute } from "./useState";

const storeProxy: Set<IState> = new Set();
const ALLOWED_TYPES = ["string", "number", "boolean"];

function toArray<TypeWidget = any>(
    data: TypeElement<TypeWidget> | TypeElement<TypeWidget>[]
) {
    return Array.isArray(data) ? data : [data];
}

function getNodeWidgetChild(ctx: ReactiveCreateElement<any>) {
    if (typeof ctx.type === 'string') return toArray(ctx.node);
    return ctx.childs.map(recursive).flat();
}

function recursive(ctx: TreeWidget) {
    if (ctx.node) {
        return ctx.node;
    }
    return each(ctx).flat();
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

export class TreeWidget<TypeWidget = any>
    implements ReactiveCreateElement<TypeWidget>
{
    isReInvoke: boolean = false;
    sharedContext: Map<string | number, any> = new Map();

    node: TypeWidget = undefined;
    parentNode: ReactiveCreateElement<TypeWidget> = undefined;

    childs: TypeElement<TypeWidget>[] = undefined;

    constructor(
        public type: ReactiveCreateElementOfType<TypeWidget>,
        public properties: Record<string, any> & {
            shareContext?: { id: string | number; ref: any };
        },
        public widgedHelper: IWidget
    ) {}

    private throwerIfNotExecute<TypeWidget = any>(
        def: TypeElement<TypeWidget>
    ) {
        if (def instanceof State) {
            if (!this.isStringableState(def)) {
                throw new Error(
                    "the execution of a state without an executing function is only allowed if they are strings, numbers or boolean values"
                );
            }
        } else if (
            typeof def === "object" &&
            typeof def.type === "function" &&
            def.type.name !== Execute.name
        ) {
            throw new Error("is not a [function Execute] ");
        }
    }

    private isStringableState(def: any) {
        if (Array.isArray(def.data)) {
            return (
                (def.data as any[]).some((data) => typeof data === "object") ===
                false
            );
        }
        return ALLOWED_TYPES.includes(typeof def.data);
    }

    private onUpdate(storeState?: IStoreState) {
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

        console.log(this, storeState, ctxParentNode, findAllIndex);

        findAllIndex.forEach((findIndex) => {
            // get index
            const def = childs.at(findIndex);
            // Generate an error if the state does not have an enveloping function
            this.throwerIfNotExecute(def);
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
                    def.render(null, null)
                );
                updateInfo.totalChilds = storeState.previousData.length;
                setTimeout(() => {
                    storeState.rendering = undefined;
                }, 0);
            }

            this.widgedHelper.updateWidget(updateInfo);
        });
    }

    render(
        isUpdate?: boolean,
        storeState?: IStoreState
    ): TypeWidget | ReactiveCreateElement<TypeWidget> | void {
        const ctxWidget: ReactiveCreateElement<TypeWidget> =
            this.getNodeWidget();

        //console.log("CALL 3", this, ctxWidget);

        if (this.node) {
            this.widgedHelper.setProperties(this.node, this.properties);
        }

        if (isUpdate && storeState) {
            if (storeState.superCtx) {
                const newRender: ReactiveCreateElement<TypeWidget> =
                    (storeState.superCtx.type as Function)
                        .call(
                            storeState.superCtx,
                            storeState.superCtx.properties,
                            storeState.superCtx.childs
                        )
                        .render();
                console.log(newRender, storeState.superCtx);
                const oldChilds = getNodeWidgetChild(storeState.superCtx);
                const nodes = getNodeWidgetChild(newRender);
                this.widgedHelper.replaceChild(nodes, oldChilds);
                newRender.parentNode = storeState.superCtx;
                storeState.superCtx.childs = toArray(newRender);
            } else {
                this.onUpdate(storeState);
            }

            return;
        }

        this.childs.forEach((child, index) => {
            const isState = child instanceof State;
            if (child instanceof TreeWidget) {
                child.parentNode = this;

                if (this.sharedContext.size) {
                    this.sharedContext.forEach(
                        (ref: any, id: string | number) => {
                            child.sharedContext.set(id, ref);
                        }
                    );
                }

                if (ctxWidget && typeof child.node === "object") {
                    //widgedHelper.removeChild(child.node, index)
                    this.widgedHelper.appendWidget(ctxWidget.node, child.node);
                }

                child.render(null, null);
            } else {
                //this.widgedHelper.removeChild(parent, index);
                if (isState) {
                    //child.parentNode = this;
                    if (
                        !storeProxy.has(child) &&
                        child.currentStoreState.superCtx
                    ) {
                        this.rewriteMethod(child);
                    } else if (!child.currentStoreState.superCtx) {
                        this.rewriteMethod(child);
                    }

                    if (ctxWidget)
                        this.renderDataState(this, ctxWidget.node, child);
                } else if (ctxWidget) {
                    this.widgedHelper.appendWidget(
                        ctxWidget.node,
                        this.widgedHelper.createText(child as any)
                    );
                }
            }
        });

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

    private renderDataState<TypeWidget = any>(
        ctx: ReactiveCreateElement<TypeWidget>,
        parent: TypeWidget,
        state: State
    ) {
        const storeState = state.currentStoreState; //state.store.get(ctx);
        if (
            Array.isArray(storeState.data) ||
            Array.isArray(storeState.rendering)
        ) {
            (storeState.rendering ?? storeState.data).forEach(
                (def: ReactiveCreateElement<TypeWidget>) => {
                    //console.log(def, this, parent);

                    this.widgedHelper.appendWidget(
                        parent,
                        typeof def === "object" ? def.render() : def
                    );
                }
            );
        } else {
            this.widgedHelper.appendWidget(parent, state);
        }
    }

    private rewriteMethod(state: IState) {
        const set = state.set.bind(state);
        const append = state.append.bind(state);

        state.set = (newValue: any) => {
            console.log("SET VALUE");
            set(newValue);
            this.render(true, state.currentStoreState);
        };

        state.append = (values: any[]) => {
            console.log("APPEND VALUE");
            append(values);
            this.render(true, state.currentStoreState);
        };

        storeProxy.add(state);
    }
}
