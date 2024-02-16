import type { TreeNative } from "../TreeNative";
import { hook } from "../hooks/hookStack";

namespace State {
    const hookTreeNative = hook('index-tree');

    /**
     * tipo acción del estado para indicar una accion de los lementos y crear cambios: creado, nuevo y actualizado
     *
     * action type of the state to indicate an action of the elements and create changes: created, new and updated
     */
    export enum Action {
        CREATE,
        NEW,
        UPDATE,
        DELETE,
    }

    export enum Scope {
        LOCAL,
        GLOBAL
    }


    /**
     * almacena cada actualizacion de estado
     *
     * stores each status update
     */
    export class StoreValues<TypeWidget> {
        private readonly store: any[] = [];

        /**
         *
         * @param superCtx context superiority
         * @param data create data
         * @param TYPE_ACTION default action create
         */
        constructor(
            data: any,
            public superCtx: TreeNative<TypeWidget> | boolean,
            public TYPE_ACTION: Action = Action.CREATE
        ) {
            this.store.push(data);
        }

        /**
         * add new data and store
         */
        set value(v: any) {
            //if (this.store.includes(v)) return;
            this.TYPE_ACTION = Array.isArray(v) ? v.length > this.previousData?.length ? Action.UPDATE : Action.DELETE : Action.NEW;
            this.store.push(v);
        }

        /**
         * current data
         */
        get value(): any {
            return this.store.at(-1);
        }

        /**
         * obtener datos anterior. sirve para controlar la diferencia del dato actual y nuevo
         *
         * get previous data It is used to control the difference between current and new data.
         */
        get previousValue(): any {
            return this.store.at(-2);
        }

        toString() {
            return this.value?.toString() ?? "";
        }
    }

    /**
 * controla el estado y la vista
 *
 * controls state and view
 */
    export class Value<TypeWidget = any> {
        private _proxyParent!: Value;

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

        public _store: Set<TreeNative<any>> = new Set();

        get parentNode(): TreeNative<any> {
            return this.currentParentNode;
        }

        get superCtx(): TreeNative<any> {
            return this.currentStoreState.superCtx;
        }

        get previousData(): TypeWidget {
            return this.currentStoreState.previousValue;
        }

        set addProxyParent(parent: Value) {
            this._proxyParent = parent;
        }

        /**
         * actualiza el nodo en el que está el estado
         *
         * update the node the status is on
         */
        set parentNode(parent: TreeNative<any>) {
            if (!this._store.has(parent)) this._store.add(parent);
            if (this._proxyParent) this._proxyParent.parentNode = parent;
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

        get value(): any {
            return this.currentStoreState.value;
        }

        set value(v: any) {
            this.currentStoreState.value = v;
        }

        constructor(
            data: any,
            superCtx: TreeNative<TypeWidget>
        ) {
            this.currentStoreState = new StoreValues<TypeWidget>(data, superCtx);
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

    export class SubRender {
        private _parentNode: TreeNative<any> = null;
        readonly node: TreeNative<any>[] = null;

        constructor(widgets: TreeNative<any>[], readonly state: State.Value) {
            this.node = widgets.map(wg => wg.render());
        }

        set parentNode(parent: TreeNative<any>) {
            this._parentNode = parent;
            this.state.parentNode = parent;
        }

        get parentNode() {
            return this._parentNode;
        }
    }

    export class InformationDesk {
        used!: boolean;
        constructor(
            readonly component: TreeNative,
            readonly scope: Scope,
            readonly state: Value,
            readonly invokeCtx: boolean
        ) { }
    }
}

export default State;