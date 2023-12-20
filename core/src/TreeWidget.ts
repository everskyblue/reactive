import { State, StoreState } from "./State";
import { IWidget, IWidgetUpdate } from "./contracts";
import {
    getNodeWidgetChild,
    getParent,
    mergeProperties,
    toArray,
} from "./utils";
import { rewriteMethodState } from "./utils";

const ALLOWED_TYPES = ["string", "number", "boolean"];

/**
 * tipos de datos de que puede tener el arbol de component
 *
 * types of data that the component tree can have
 */
export type TypeChildNode = string | boolean | number | State | TreeWidget<any>;

/**
 * type de valores de las etiquetas jsx
 *
 * jsx tag values type
 */
export type TreeWidgetOfType<AnyWidget> =
    | string
    | ((
        props: ReactiveProps
        //childs?: TypeChildNode<AnyWidget>
    ) => TreeWidget<AnyWidget> | TreeWidget<AnyWidget>[]);

export type ReactivePropsWithChild<
    Properties = {}
> = Properties & {
    children?: TypeChildNode[];
};

export type ReactiveProps<Properties = {}> = Omit<
    ReactivePropsWithChild<Properties>,
    "children"
>;

const id = {
    pos: 0,
    current: 0
}

export class TreeWidget<TypeWidget = any> {
    isReInvoke: boolean = false;

    node: TypeWidget = undefined;

    parentNode: TreeWidget<TypeWidget> = undefined;

    childs: TypeChildNode[] = undefined;

    readonly _id: number = id.pos;

    private _ns: boolean = false;

    private _fnparent: TreeWidget = undefined;

    private _listenerOnCreate: (element: TypeWidget | undefined) => any = () => void 0;

    constructor(
        public type: TreeWidgetOfType<TypeWidget>,
        public properties: Record<string, any>,
        public widgedHelper: IWidget,
        public originalChilds: TypeChildNode[]
    ) {
        if (typeof this.type === 'string' && this.type === 'svg') {
            this._ns = true;
        }

        if (properties && properties.onCreate) {
            this._listenerOnCreate = properties.onCreate;
            delete this.properties.onCreate;
        }

        for (let child of originalChilds) {
            if (this._ns && child instanceof TreeWidget)
                child._ns = true;
            if (typeof this.type === 'function' && child instanceof TreeWidget)
                child._fnparent = this;
        }

        id.pos++;
    }

    #throwerIfNotExecute<TypeWidget = any>(def: TypeChildNode) {
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
    
    /**
     * comprueba si son datos crudos
     */
    #isStringableState(state: State) {
        if (Array.isArray(state.data)) {
            return (
                (state.data as any[]).some((data) => typeof data === "object") ===
                false
            );
        }
        return ALLOWED_TYPES.includes(typeof state.data);
    }
    
    /**
     * actualiza los nodos 
     */
    #onUpdate(storeState: StoreState<TypeWidget>) {
        const ctxParentNode: TreeWidget<TypeWidget> =
            typeof this.type === "function" ? getParent(this) : this;
        const childs = ctxParentNode.childs;

        // Find the matching indexes
        for (let index = 0, child: TypeChildNode; child = childs[index]; index++) {
            if (this !== child || !(child instanceof State && child.data === storeState.data)) continue;
            // Generate an error if the state does not have an enveloping function
            this.#throwerIfNotExecute(child);
            // info update
            const updateInfo = {
                isStringable: false,
                node: ctxParentNode.node,
                typeAction: storeState.TYPE_ACTION,
                updateIndex: index,
            } as IWidgetUpdate<TypeWidget>;

            if (child instanceof State) {
                Object.assign(updateInfo, {
                    isStringable: true,
                    state: storeState.data,
                    totalChilds: childs.length,
                });
            }
            if (
                child instanceof TreeWidget &&
                typeof child.type == "function"
            ) {
                const nwchilds = child.type.call(this,
                    mergeProperties.call(this, true)
                ) as unknown as any;
                if (storeState.parentNode) {
                    updateInfo.state =
                        storeState.rendering
                            ?.map((def) => getNodeWidgetChild(def.render()))
                            .flat() ?? getNodeWidgetChild(storeState.data); //?? (storeState.data instanceof TreeWidget) ? [storeState.data.render()] : (()=> {throw "error"})();
                } else {
                }
                updateInfo.totalChilds = storeState.previousData.length;
                /* setTimeout(() => {
                    storeState.rendering = undefined;
                }, 0); */
            }

            this.widgedHelper.updateWidget(updateInfo);
        }
    }

    #onUpdateSuperCtx(superCtx: TreeWidget<TypeWidget>) {
        superCtx.isReInvoke = true;
        const newRender: TreeWidget<TypeWidget> | TreeWidget<TypeWidget>[] = (
            superCtx.type as Function
        ).call(superCtx, mergeProperties.call(superCtx, true));
        const oldChilds: TypeWidget[] = getNodeWidgetChild(superCtx);
        let nwChilds: TypeWidget[];

        if (newRender instanceof TreeWidget) {
            newRender.isReInvoke = true;
            newRender.render();
            nwChilds = getNodeWidgetChild(newRender);
            newRender.parentNode = superCtx;
        } else if (Array.isArray(newRender)) {
            nwChilds = newRender.map((widget) =>
                getNodeWidgetChild(widget.render()).at(0)
            );
        } else {
            throw new Error("could not resolve nodes");
        }

        this.widgedHelper.replaceChild(
            this.getNodeWidget().node,
            nwChilds,
            oldChilds
        );
        
        superCtx.childs = toArray(newRender);
    }

    createNodeAndChilds() {
        if (typeof this.type === "string") {
            this.node = this.widgedHelper.createWidget(this.type, this._ns);
            this.childs = toArray(this.originalChilds);
        }
    }

    #renderChild() {
        const ctxWidget: TreeWidget<TypeWidget> = this.getNodeWidget();

        for (let child of this.childs) {
            if (child instanceof TreeWidget || child instanceof State) {
                child.parentNode = this;
            }

            if (child instanceof TreeWidget) {
                /**
                 * cuando es un componente todos los elementos hace referencia al componente padre
                 */
                if (typeof this.type === "function") {
                    child._fnparent =
                        this.type.name !== "Fragment" ? this : this._fnparent;
                } else if (typeof this.type === "string" && this._fnparent) {
                    child._fnparent = this._fnparent;
                }

                if (typeof child.type === "string" && this._ns) {
                    child._ns = true;
                    child.createNodeAndChilds();
                }

                if (this.isReInvoke) {
                    child.createNodeAndChilds();
                    child.isReInvoke = true;
                }

                if (ctxWidget && typeof child.node === "object") {
                    this.widgedHelper.appendWidget(ctxWidget.node, child.node);
                }

                child.render();
            } else {
                if (child instanceof State) {
                    this.implementStates(child);

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
        }
    }

    #renderDataState <TypeWidget = any>(
        ctx: TreeWidget<TypeWidget>,
        parent: TypeWidget,
        state: State
    ) {
        const storeState = state.currentStoreState;
        if (
            Array.isArray(storeState.data) ||
            Array.isArray(storeState.rendering)
        ) {
            (storeState.rendering ?? storeState.data).forEach(
                (def: TreeWidget<TypeWidget>) => {
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

    #reRender(storeState: StoreState<TypeWidget>) {
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

        this._listenerOnCreate(this.node);

        return this;
    }

    /**
     * el nodo es un objeto que representa la vista
     * si no hay significa que es una funcion
     * buscara el objecto de que representa la vista
     */
    getNodeWidget(): TreeWidget<TypeWidget> {
        if (typeof this.node === "object") {
            return this;
        }
        return getParent(this);
    }

    implementStates(...states: State[]) {
        rewriteMethodState(states, state => {
            this.#reRender(state.currentStoreState);
        });
    }
}
