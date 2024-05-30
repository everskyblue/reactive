import type { TreeNative } from "./TreeNative";
import { listener } from "./hooks/useState";

/**
 * tipo acción del estado para indicar una accion de los lementos y crear cambios: creado, nuevo y actualizado
 *
 * action type of the state to indicate an action of the elements and create changes: created, new and updated
 */
export enum StateAction {
    CREATE,
    NEW,
    UPDATE,
    DELETE,
}

export class StateRender {
    _parentNode: TreeNative<any> = null;
    readonly node: TreeNative<any>[] = null;
    
    constructor(widgets: TreeNative<any>[], readonly state: State) {
        this.node = widgets.map(wg => wg.render());
    }
    
    set parentNode(parent: TreeNative<any>) {
        this._parentNode = parent;
        listener(parent, this.state);
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
    private readonly store: any[] = [];
    public parentNode: TreeNative<any>;

    /**
     *
     * @param superCtx context superiority
     * @param data create data
     * @param TYPE_ACTION default action create
     */
    constructor(
        data: any,
        public superCtx: TreeNative<TypeWidget>,
        public TYPE_ACTION: StateAction = StateAction.CREATE
    ) {
        this.data = data;
    }

    /**
     * add new data and store
     */
    public set data(v: any) {
        //if (this.store.includes(v)) return;
        if (Array.isArray(v)) {
            this.TYPE_ACTION = v.length > this.previousData?.length ? StateAction.UPDATE : StateAction.DELETE; //v.length < this.previousData.length;
        }
        this.store.push(v);
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
    currentParentNode: TreeNative<any>;

    /**
     * cada vez se cambie el elemento padre del estado modifica a un nuevo almacenamiento de estado
     * por si retorna nuevos valores de vista
     *
     * each time the parent element of the state is changed,
     * it modifies a new state store in case it returns new view values
     */
    public currentStoreState: StoreState<TypeWidget>;

    public _store: Map<TreeNative<any>, StoreState<TypeWidget>> =
        new Map();

    public get parentNode(): TreeNative<any> {
        return this.currentParentNode;
    }
    
    public get superCtx(): TreeNative<any> {
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
    public set parentNode(parent: TreeNative<any>) {
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

    public get value(): any {
        return this.currentStoreState.data;
    }

    public set value(v: any) {
        this.currentStoreState.data = v;
    }

    constructor(
        data: any,
        superCtx: TreeNative<TypeWidget>
    ) {
        this.currentStoreState = new StoreState<TypeWidget>(data, superCtx);
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
        this.value = newValue;
    }

    /**
     * is more for true and false values (value === data)
     *
     * @returns
     */
    is(value: any): boolean {
        return this.value === value;
    }

    toString() {
        return this.currentStoreState.toString();
    }

    [Symbol.toPrimitive]() {
        return this.toString();
    }

    *[Symbol.iterator]() {
        for (const iterator of this.value) {
            yield iterator;
        }
    }
}
