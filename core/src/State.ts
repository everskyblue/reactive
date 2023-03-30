import { ReactiveCreateElement } from "./implements";

/**
 * NEW STATE = CREATE
 * 
 * STATE.SET = NEW
 * 
 * STATE.APPEND = UPDATE
 * 
 * Object.Function  Return view = PREPEND is priority
 */
export enum StateAction {
    CREATE,
    NEW,
    UPDATE,
    PREPEND,
}

export class StoreState {
    public rendering: ReactiveCreateElement<any>[];
    private _current: any;
    private store: any[] = [];
    public parentNode: ReactiveCreateElement<any>;

    constructor(
        data: any,
        public TYPE_ACTION: StateAction = StateAction.CREATE
    ) {
        this.data = data;
    }

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

        // not ReactiveCreateElement<any>[]
        if (this.TYPE_ACTION !== StateAction.PREPEND) {
            // So you can get the above data correctly and you can update the widget
            if (this.TYPE_ACTION === StateAction.UPDATE) {
                this.store.push([...current, ...this._current]);
            } else {
                this.store.push(this._current);
            }
        }
    }

    public get data(): any {
        return this._current;
    }

    public get previousData(): any {
        return this.store.at(this.store.indexOf(this.data) - 1);
    }

    toString() {
        return this.data?.toString() ?? "";
    }
}

export class State implements Record<string, any> {
    proxySelf: State;

    currentParentNode: ReactiveCreateElement<any>;

    public currentStoreState: StoreState;

    public store: Map<ReactiveCreateElement<any>, StoreState> = new Map();

    public get parentNode(): ReactiveCreateElement<any> {
        return this.currentParentNode;
    }

    public set parentNode(parent: ReactiveCreateElement<any>) {
        this.currentParentNode = parent;

        if (
            typeof this.currentStoreState.parentNode !== "undefined" &&
            this.currentStoreState.parentNode !== parent
        ) {
            this.currentStoreState = new StoreState(
                this.currentStoreState.data
            );
        }

        this.currentStoreState.parentNode = parent;
        this.store.set(parent, this.currentStoreState);
    }

    public get data(): any {
        return this.currentStoreState.data;
    }

    public set data(v: any) {
        this.currentStoreState.data = v;
    }

    constructor(data: any) {
        this.currentStoreState = new StoreState(data);
    }

    addProxySelf(proxy: State) {
        this.proxySelf = proxy;
    }

    set(newValue: any) {
        this.currentStoreState.TYPE_ACTION = StateAction.NEW;
        this.currentStoreState.data = newValue;
        this.invokeNode();
    }

    append(values: any[]) {
        this.currentStoreState.TYPE_ACTION = StateAction.UPDATE;
        this.currentStoreState.data = values;
        this.invokeNode();
    }

    invokeNode() {
        this.store.forEach((storeState, ctx) => {
            ctx.render(true, storeState);
        });
    }

    $setReturnData(value: any) {
        this.currentStoreState.TYPE_ACTION = StateAction.PREPEND;
        this.currentStoreState.data = value;
    }

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
