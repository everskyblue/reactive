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
        const current = this.data;

        if (
            this.TYPE_ACTION === StateAction.NEW ||
            this.TYPE_ACTION === StateAction.CREATE
        ) {
            this._current = v;
        } else if (this.TYPE_ACTION === StateAction.UPDATE) {
            this._current = v;
        } else if (this.TYPE_ACTION === StateAction.PREPEND) {
            this.rendering = v;
        }

        // not TreeWidget<any>[]
        if (this.TYPE_ACTION !== StateAction.PREPEND) {
            if (this.store.includes(v)) return;
            // So you can get the above data correctly and you can update the widget
            if (this.TYPE_ACTION === StateAction.UPDATE) {
                this.store.push(
                    (this._current = [...current, ...this._current])
                );
            } else {
                this.store.push(this._current);
            }
        }
    }

    /**
     * current data
     */
    public get data(): any {
        return this._current;
    }

    /**
     * obtener datos anterior. sirve para controlar la diferencia del dato actual y nuevo
     *
     * get previous data It is used to control the difference between current and new data.
     */
    public get previousData(): any {
        return this.store.at(-1);
    }

    toString() {
        return this.data?.toString() ?? "";
    }
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

    /**
     * actualiza el nodo en el que está el estado
     *
     * update the node the status is on
     */
    public set parentNode(parent: TreeWidget<any>) {
        this.currentParentNode = parent;
        if (
            typeof this.currentStoreState.parentNode !== "undefined" &&
            this.currentStoreState.parentNode !== parent
        ) {
            this.currentStoreState = new StoreState<TypeWidget>(
                this.superCtx,
                this.currentStoreState.data
            );
        }

        this.currentStoreState.parentNode = parent;
        this.store.set(parent, this.currentStoreState);
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
        private superCtx: TreeWidget<TypeWidget>
    ) {
        this.currentStoreState = new StoreState<TypeWidget>(superCtx, data);
    }

    /**
     *
     * @param proxy store proxy
     */
    addProxySelf(proxy: State) {
        this.proxySelf = proxy;
    }

    /**
     * nuevo estado
     *
     * new state
     */
    set(newValue: any) {
        setData(this.currentStoreState);

        function setData(storeState: StoreState<TypeWidget>) {
            storeState.TYPE_ACTION = StateAction.NEW;
            storeState.data = newValue;
        }
    }

    /**
     * empuja nuevos datos al arreglo
     *
     * push new data to array
     */
    append(values: any[]) {
        this.currentStoreState.TYPE_ACTION = StateAction.UPDATE;
        this.currentStoreState.data = values;
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
     * si el tipo de dato que a añadido en invoca una funcion retornando nuevos valores,
     * esta funcion añade esos nuevos datos.
     * sirve mas para un arreglo de elementos que devuelve una vista
     *
     * If the data type you added in invokes a function returning new values,
     * this function adds that new data.
     * it works better for an array of elements that returns a view
     *
     * @example
     * ```javascript
     *  state.map(value => (<p>{value}</p>));
     * ```
     */
    $setReturnData(value: any) {
        this.currentStoreState.TYPE_ACTION = StateAction.PREPEND;
        this.currentStoreState.data = value;
        return value;
    }

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
