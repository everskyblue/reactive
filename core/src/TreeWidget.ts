import { State, StoreState, StateRender } from "./State";
import { exec } from "./hooks";
import {
    getNodeWidgetChild,
    getParent,
    mergeProperties,
    toArray,
} from "./utils";
import { setListenerStates } from "./utils";

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

/**
 * parametros que recibe cuando el estado cambia de valor
 * controla cada elemento si se añade o se elimina del vista
 *
 * parameters that it receives when the state changes
 * its value control each element if it is added or removed from the view
 */
export interface UNativeRender<TypeNative = any> {
    get index(): number;
    get newChilds(): TypeNative[];
    get oldChilds(): TypeNative[];
    getNodeParent(): TypeNative;
    getParent(): TreeWidget<TypeNative>;
}

/**
 * interface para el manejo y controlar de la aplicacion
 * se llama cuando se va a renderizar el component
 *
 * interface for managing and controlling the application is called
 * when the component is going to be rendered
 */
export interface NativeRender<TypeNative = any> {
    resetWidgets?: (widgets: TypeNative[]) => void;
    createWidget(type: string, ns: boolean): SVGElement | TypeNative;
    setProperties(parent: TypeNative, props: Record<string, any>): void;
    appendWidget(
        parent: TypeNative,
        childs: TreeWidget | StateRender | any
    ): void;
    querySelector(selector: string): TypeNative;
    updateWidget(urender: UNativeRender<TypeNative>): void;
}

export function _onUpdate<TypeNative = any>(storeState: StoreState<TypeNative>) {
        this.isReInvoke = true;
        const parent = this.parentNode;
        const ctxParentNode: TreeWidget<TypeNative> =
            typeof this.type === "function" ? getParent(this) : this;

        const childs = this.childs;
        let updateByIndex = childs.findIndex(child => child instanceof TreeWidget || child instanceof State || (child instanceof StateRender && child.state.currentStoreState === storeState));
        //if (updateByIndex === -1)
        
        const child = childs[updateByIndex];
        const oldChilds = child instanceof TreeWidget ? [child] : child instanceof StateRender ? child.node : child.toString();

        if (typeof this.type === 'function') {
            childs[updateByIndex] = this.type.call(this, mergeProperties.call(this, true));
        }

        const newChild = childs[updateByIndex];
        const isTree = newChild instanceof TreeWidget;
        
        if (isTree) {
            newChild.parentNode = this;
        }
        
        const newValues = isTree ? [newChild.render()] : newChild instanceof State ? newChild.toString() : newChild.node;
        
        this.widgedHelper.updateWidget(new class implements UNativeRender {
            getNodeParent() {
                return ctxParentNode.node;
            }

            getParent() {
                return parent;
            }

            get index() {
                return updateByIndex;
            }

            get newChilds() {
                return newValues;
            }

            get oldChilds() {
                return oldChilds;
            }
        });
    }

const id = {
    pos: 0,
    current: 0
}

export class TreeWidget<TypeNative = any> {
    isReInvoke: boolean = false;

    node: TypeNative = undefined;

    parentNode: TreeWidget<TypeNative> = undefined;

    childs: TypeChildNode[] = undefined;

    readonly _id: number = id.pos;

    private _ns: boolean = false;

    private _fnparent: TreeWidget = undefined;

    private _listenerOnCreate: (element: TypeNative | undefined) => any = () => void 0;

    constructor(
        public type: TreeWidgetOfType<TypeNative>,
        public properties: Record<string, any>,
        public widgedHelper: NativeRender,
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

    #throwerIfNotExecute<TypeNative = any>(def: TypeChildNode) {
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

    createNodeAndChilds() {
        if (typeof this.type === "string") {
            this.node = this.widgedHelper.createWidget(this.type, this._ns);
            this.childs = toArray(this.originalChilds);
        }
    }

    #renderChild() {
        const ctxWidget: TreeWidget<TypeNative> = this.getNodeWidget();

        for (let child of this.childs) {
            if (child instanceof TreeWidget || child instanceof State || child instanceof StateRender) {
                child.parentNode = this;
            }
            //console.log(child);
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

                child.render();
                this.widgedHelper.appendWidget(this, child);
            } else if (child instanceof StateRender) {
                this.widgedHelper.appendWidget(this, child);
            } else {
                this.widgedHelper.appendWidget(this, child instanceof State ? (this.implementStates(child), child.toString()) : child);
            }
        }
    }

    #renderDataState <TypeNative = any>(
        ctx: TreeWidget<TypeNative>,
        parent: TypeNative,
        state: State
    ) {
        const storeState = state.currentStoreState;
        if (
            Array.isArray(storeState.data) ||
            Array.isArray(storeState.rendering)
        ) {
            (storeState.rendering ?? storeState.data).forEach(
                (def: TreeWidget<TypeNative>) => {
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

    #reRender(storeState: StoreState<TypeNative>) {
        return storeState.superCtx
            ? _onUpdate.call(storeState.superCtx, storeState)
            : _onUpdate.call(this, storeState);
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
    getNodeWidget(): TreeWidget<TypeNative> {
        if (typeof this.node === "object") {
            return this;
        }
        return getParent(this);
    }

    implementStates(...states: State[]) {
        setListenerStates(states, (state) => {
            this.#reRender(state.currentStoreState);
        });
    }
}
