import {
    IStoreState,
    IWidget,
    IWidgetUpdate,
    ReactiveCreateElement,
    ReactiveCreateElementOfType,
    TypeElement,
} from "./contracts";
import { State } from "./State";
import { Execute } from "./useState";

let time = 0;
let call = 0;

function toArray<TypeWidget = any>(
    data: TypeElement<TypeWidget> | TypeElement<TypeWidget>[]
) {
    return Array.isArray(data) ? data : [data];
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

export class TreeWidget<TypeWidget = any>
    implements ReactiveCreateElement<TypeWidget>
{
    isReInvoke: boolean = false;
    sharedContext: Map<string | number, any> = new Map();

    node: TypeWidget;
    parentNode: ReactiveCreateElement<TypeWidget>;

    childs: TypeElement<TypeWidget>[];

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
        return ["string", "number", "boolean"].includes(typeof def.data);
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
        storeState?: IStoreState,
        oldDataState?: any
    ): TypeWidget | ReactiveCreateElement<TypeWidget> | void {
        const ctxParentNode: ReactiveCreateElement<TypeWidget> =
            typeof this.type === "function" ? getParent(this) : this;
        console.log("CALL 3", this, isUpdate, storeState);
        if (isUpdate && storeState) {
            if (call) throw "errorx";
            if (!call) call += 1;
            if (storeState.superCtx) {
                const { type, properties, childs } = storeState.superCtx;

                storeState.superCtx.isReInvoke = true;
                /*const superCtxParent = getParent(
                    storeState.superCtx
                ) as ReactiveCreateElement<TypeWidget>;
                const index = superCtxParent.childs.findIndex(
                    (child) => child === storeState.superCtx
                );*/
                const nwThree = (type as Function).call(
                    storeState.superCtx,
                    storeState.superCtx.properties,
                    storeState.superCtx.childs
                );
                //const nwWidget = nwThree.render(true, false);
                console.log(type.toString(), this, isUpdate, storeState);
                //console.log(index, nwThree, nwWidget, storeState.superCtx);
                /*
                this.widgedHelper.replaceChild(
                    superCtxParent.node,
                    toArray(nwWidget),
                    storeState.superCtx.childs.map(
                        (tree: ReactiveCreateElement<TypeWidget>) => tree.node
                    )
                );

                storeState.superCtx.childs = toArray(nwThree);
                */
                return; //storeState.superCtx.render(true);
            }
            console.log("updatr stotr");
            return this.onUpdate(storeState);
        }
        if (isUpdate) {
            /*this.childs.forEach((element) => {
                if (element instanceof TreeWidget) {
                    element.render();
                }
                console.log(ctxParentNode, element);
            });*/
            //console.log(this);
            if (time === 100) {
                debugger;
                throw "error ";
            }
            time += 1;
            return this.node ?? this;
        }
        //console.log(this.childs, "childs");

        (this.childs as TypeElement<TypeWidget>[]).forEach(
            (child: ReactiveCreateElement<TypeWidget>, index) => {
                const isState = child instanceof State;

                if (["string", "number", "boolean"].includes(typeof child)) {
                    //widgedHelper.removeChild(ctxParentNode.node, index);
                }
                //console.log(child);

                if (child instanceof TreeWidget) {
                    if (this.sharedContext.size) {
                        this.sharedContext.forEach(
                            (ref: any, id: string | number) => {
                                child.sharedContext.set(id, ref);
                            }
                        );
                    }

                    const { node } = ctxParentNode;

                    if (typeof child.node === "object") {
                        this.widgedHelper.setProperties(
                            child.node,
                            child.properties
                        );
                        //widgedHelper.removeChild(child.node, index)
                        this.widgedHelper.appendWidget(node, child.node);
                    }

                    child.render(null, null);
                } else {
                    const parent =
                        this.node ?? getParent<TypeWidget>(this).node;
                    //this.widgedHelper.removeChild(parent, index);
                    if (isState) {
                        this.renderDataState(this, parent, child);
                    } else {
                        this.widgedHelper.appendWidget(
                            parent,
                            this.widgedHelper.createText(child)
                        );
                    }
                }
            }
        );

        return this.node ?? this;
    }

    getParentNode(): ReactiveCreateElement<TypeWidget> {
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
        const storeState = state.store.get(ctx);
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
}
