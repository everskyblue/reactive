import { State, StoreState, StateRender } from "./State";
import { listener } from "./hooks/useState";
import {
    getNodeWidgetChild,
    getParent,
    mergeProperties,
    toArray,
} from "./utils";

const ALLOWED_TYPES = ["string", "number", "boolean"];

/**
 * tipos de datos de que puede tener el arbol de component
 *
 * types of data that the component tree can have
 */
export type TypeChildNode = string | boolean | number | State | TreeNative<any> | StateRender;

/**
 * type de valores de las etiquetas jsx
 *
 * jsx tag values type
 */
export type TreeNativeOfType<AnyWidget> =
    | string
    | ((
        props: ReactiveProps
        //childs?: TypeChildNode<AnyWidget>
    ) => TreeNative<AnyWidget> | TreeNative<AnyWidget>[]);

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
 * controla cada elemento si se añade o se elimina de la vista
 *
 * parameters that it receives when the state changes
 * its value control each element if it is added or removed from the view
 */
export interface UNativeRender<TypeNative = any> {
    get index(): number;
    get newChilds(): TypeNative[];
    get oldChilds(): TypeNative[];
    getNodeParent(): TypeNative;
    getParent(): TreeNative<TypeNative>;
}

/**
 * interface para el manejo y control de la aplicacion
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
        childs: TreeNative | StateRender | any
    ): void;
    querySelector(selector: string): TypeNative;
    updateWidget(urender: UNativeRender<TypeNative>): void;
}

export function _onUpdate<TypeNative = any>(storeState: StoreState<TypeNative>) {
    this.isReInvoke = true;
    id.component = this;
    const parent = this.parentNode;
    const ctxParentNode: TreeNative<TypeNative> =
        typeof this.type === "function" ? getParent(this) : this;

    const childs = this.childs;
    // esto es para un estado que no renderiza el componente principal 
    const accumulator = { findIndex: [], oldChilds: [] };
    const updateBy = storeState.superCtx ? accumulator : this.childs.reduce((update, child, pos) => {
        if (/*(child instanceof TreeNative && this === child) || */(child instanceof State && child.currentStoreState === storeState) || (child instanceof StateRender && child.state.currentStoreState === storeState)) {
            update.findIndex.push(pos);
            update.oldChilds.push(child instanceof State ? child.toString() : child.node);
        }
        return update;
    }, accumulator);

    const newChilds = typeof this.type === 'function' ? this.type.call(this, mergeProperties.call(this, true)) : false

    if (newChilds !== false) {
        newChilds.parentNode = this;
        this.childs = toArray(newChilds);
    }

    if (newChilds instanceof TreeNative) {
        newChilds.isReInvoke = true;
        newChilds.render();
    }

    for (let index = 0; index < updateBy.findIndex.length; index++) {
        const position = updateBy.findIndex[index];
        const oldChild = updateBy.oldChilds[index];
        this.widgedHelper.updateWidget(new class implements UNativeRender {
            getNodeParent() {
                return ctxParentNode.node;
            }

            getParent() {
                return parent;
            }

            get index() {
                return position;
            }

            get newChilds() {
                return newChilds instanceof StateRender ? newChilds.node : newChilds instanceof TreeNative ? toArray(newChilds) : oldChild;
            }

            get oldChilds() {
                return oldChild;
            }
        });
    }

    if (updateBy.findIndex.length === 0)
        this.widgedHelper.updateWidget(new class implements UNativeRender {
            getNodeParent() {
                return ctxParentNode.node;
            }

            getParent() {
                return parent;
            }

            get index() {
                return -1;
            }

            get newChilds() {
                return newChilds instanceof StateRender ? newChilds.node : newChilds instanceof TreeNative ? toArray(newChilds) : newChilds;
            }

            get oldChilds() {
                return childs;
            }
        });
}

export const id = {
    pos: 0,
    current: 0,
    component: null
}

export class TreeNative<TypeNative = any> {
    isReInvoke: boolean = false;

    node: TypeNative = undefined;

    parentNode: TreeNative<TypeNative> = undefined;

    childs: TypeChildNode[] = undefined;

    readonly _id: number = id.pos;

    private _ns: boolean = false;

    private _fnparent: TreeNative = undefined;

    private _listenerOnCreate: (element: TypeNative | undefined) => any = () => void 0;

    constructor(
        public type: TreeNativeOfType<TypeNative>,
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
            if (this._ns && child instanceof TreeNative)
                child._ns = true;
            if (typeof this.type === 'function' && child instanceof TreeNative)
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
        if (Array.isArray(state.value)) {
            return (
                (state.value as any[]).some((data) => typeof data === "object") ===
                false
            );
        }
        return ALLOWED_TYPES.includes(typeof state.value);
    }

    createNodeAndChilds() {
        if (typeof this.type === "string") {
            this.node = this.widgedHelper.createWidget(this.type, this._ns);
            this.childs = toArray(this.originalChilds);
        }
    }

    #renderChild() {
        const ctxWidget: TreeNative<TypeNative> = this.getNodeWidget();

        for (let index = 0, child; child = this.childs[index] && child < this.childs.length; index++) {
            if (child instanceof TreeNative || child instanceof State || child instanceof StateRender) {
                child.parentNode = this;
                 if (!(child instanceof TreeNative)) {
                    ('state' in child ? child.state : child).handlers.push(() => {
                        console.log(index);
                        
                    })
                 }
            }
            //console.log(child);
            if (child instanceof TreeNative) {
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
                this.widgedHelper.appendWidget(this, child instanceof State ? (listener(this, child), child.toString()) : child);
            }
        }
    }

    /* #renderDataState <TypeNative = any>(
        ctx: TreeNative<TypeNative>,
        parent: TypeNative,
        state: State
    ) {
        const storeState = state.currentStoreState;
        if (
            Array.isArray(storeState.data) ||
            Array.isArray(storeState.rendering)
        ) {
            (storeState.rendering ?? storeState.data).forEach(
                (def: TreeNative<TypeNative>) => {
                    this.widgedHelper.appendWidget(
                        parent,
                        def instanceof TreeNative ? def.render().node : def
                    );
                }
            );
        } else {
            this.widgedHelper.appendWidget(parent, state);
        }
    } */

    #reRender(storeState: StoreState<TypeNative>) {
        return storeState.superCtx
            ? _onUpdate.call(storeState.superCtx, storeState)
            : _onUpdate.call(this, storeState);
    }

    render(): TreeNative {
        id.component = this;
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
    getNodeWidget(): TreeNative<TypeNative> {
        if (typeof this.node === "object") {
            return this;
        }
        return getParent(this);
    }

    $update(state: State) {
        _onUpdate.call(this, state.currentStoreState)
    }
}
