import { TreeWidget } from "./TreeWidget";

/**
 * tipo acción del estado para indicar una accion de los lementos y crear cambios: creado, nuevo y actualizado
 *
 * action type of the state to indicate an action of the elements and create changes: created, new and updated
 */
export enum StateAction {
    // create state
    CREATE,

    // new state
    NEW,

    // update current state
    UPDATE,

    /**
     * manejo interno del renderizado si el estado a devuelto un nuevo objecto de valores
     *
     * internal handling of rendering if the state has returned a new values object
     * @see {@link TreeWidget}
     */
    PREPEND,
}

export class StateRender {
    _parentNode: TreeWidget<any> = null;
    readonly node: TreeWidget<any>[] = null;
    
    constructor(widgets: TreeWidget<any>[], readonly state: State) {
        this.node = widgets.map(wg => wg.render());
    }
    
    set parentNode(parent: TreeWidget<any>) {
        this._parentNode = parent;
        parent.implementStates(this.state);
    }
    
    get parentNode() {
        return this._parentNode;
    }
}

/**
 * almacena cada actualizacion de estado
 *
 * stores each status update
 */
export class StoreState<TypeWidget> {
    public rendering: TreeWidget<any>[];
    private _current: any;
    private store: any[] = [];
    public parentNode: TreeWidget<any>;

    /**
     *
     * @param superCtx context superiority
     * @param data create data
     * @param TYPE_ACTION default action create
     */
    constructor(
        public superCtx: TreeWidget<TypeWidget>,
        data: any,
        public TYPE_ACTION: StateAction = StateAction.CREATE
    ) {
        this.data = data;
    }

    /**
     * add new data and store
     */
    public set data(v: any) {
        if (this.TYPE_ACTION === StateAction.PREPEND) {
            this.rendering = v;
        }

        // not TreeWidget<any>[]
        if (this.TYPE_ACTION !== StateAction.PREPEND) {
            if (this.store.includes(v)) return;
            this.store.push(v);
        }
    }

    /**
     * current data
     */
    public get data(): any {
        return this.store.at(-1);
    }

    /**
     * obtener datos anterior. sirve para controlar la diferencia del dato actual y nuevo
     *
     * get previous data It is used to control the difference between current and new data.
     */
    public get previousData(): any {
        return this.store.at(-2);
    }

    toString() {
        return this.data?.toString() ?? "";
    }
}
function setData(newValue: any, storeState: StoreState<any>, action: StateAction) {
    storeState.TYPE_ACTION = action;
    storeState.data = newValue;
}
/**
 * controla el estado y la vista
 *
 * controls state and view
 */
export class State<TypeWidget = any> implements Record<string, any> {
    proxySelf: State;

    /**
     * se actualiza cada vez que el estado es añadido a un elemento
     *
     * is updated each time the state is added to an element
     *
     * @example
     * ```javascript
     *  function App() {
     *     const useGreeting = useState('hello work')
     *      return (
     *          <div>
     *             <p>{useGreeting}</p>
     *             <p>{useGreeting}</p>
     *          </div>
     *      );
     * }
     * ```
     */
    currentParentNode: TreeWidget<any>;

    /**
     * cada vez se cambie el elemento padre del estado modifica a un nuevo almacenamiento de estado
     * por si retorna nuevos valores de vista
     *
     * each time the parent element of the state is changed,
     * it modifies a new state store in case it returns new view values
     */
    public currentStoreState: StoreState<TypeWidget>;

    public store: Map<TreeWidget<any>, StoreState<TypeWidget>> =
        new Map();

    public get parentNode(): TreeWidget<any> {
        return this.currentParentNode;
    }
    
    public get superCtx(): TreeWidget<any> {
        return this.currentStoreState.superCtx;
    }
    
    public get previousData(): TypeWidget {
        return this.currentStoreState.previousData;
    }

    /**
     * actualiza el nodo en el que está el estado
     *
     * update the node the status is on
     */
    public set parentNode(parent: TreeWidget<any>) {
        /*this.currentParentNode = parent;
        if (
            typeof this.currentStoreState.parentNode !== "undefined" &&
            this.currentStoreState.parentNode !== parent
        ) {
            const rendering = this.currentStoreState.rendering;
            this.currentStoreState = new StoreState<TypeWidget>(
                this.superCtx,
                this.currentStoreState.data
            );
            this.currentStoreState.rendering = rendering;
            
        }

        this.currentStoreState.parentNode = parent;
        this.store.set(parent, this.currentStoreState);*/
    }

    public get data(): any {
        return this.currentStoreState.data;
    }

    /* public set data(v: any) {
        this.store.forEach((storeState, ctx) => {
            storeState.data = v;
        });
        //this.currentStoreState.data = v;
    } */

    constructor(
        data: any,
        superCtx: TreeWidget<TypeWidget>
    ) {
        this.currentStoreState = new StoreState<TypeWidget>(superCtx, data);
    }

    /**
     *
     * @param proxy store proxy
     */
    addProxySelf(proxy: State) {
        this.proxySelf = proxy;
        return this;
    }

    /**
     * nuevo estado
     *
     * new state
     */
    set(newValue: any) {
        setData(newValue, this.currentStoreState, StateAction.NEW);
    }

    /**
     * si hay nuevos datos invoca la funcion envolvente que retorna los nuevos valores
     *
     * if there is new data, call the enclosing function that returns the new values
     */
    /*invokeNode() {
        if (this.store.size > 1) {
            throw new Error("error");
        }
        for (const [ctx, storeState] of this.store.entries()) {
            console.log("RENDER STATE", ctx, storeState);
            ctx.render(true, storeState);
        }
    }*/

    /**
     * is more for true and false values (value === data)
     *
     * @returns
     */
    is(value: any): boolean {
        return this.currentStoreState.data === value;
    }

    toString() {
        return this.currentStoreState.toString();
    }

    [Symbol.toPrimitive]() {
        return this.toString();
    }

    *[Symbol.iterator]() {
        for (const iterator of this.currentStoreState.data) {
            yield iterator;
        }
    }
}
