import { ReactiveCreateElement } from "./implements";

export class State implements Record<string, any> {
    //parentNode: ReactiveCreateElement<any> = undefined;
    proxySelf: State;

    oldData: any = undefined;

    nwdata: any = undefined;

    currentParentNode: ReactiveCreateElement<any> = undefined;

    private readonly _listParentNode: Set<ReactiveCreateElement<any>> = new Set();
    private readonly _mapParentNode: Map<ReactiveCreateElement<any>, State> = new Map();

    public get mapParentNode(): Map<ReactiveCreateElement<any>, State> {
        return this._mapParentNode;
    }

    private listeners: Map<ReactiveCreateElement<any>, Function> = new Map();

    public get parentNode(): ReactiveCreateElement<any> {
        return this.currentParentNode;
    }

    public set parentNode(v: ReactiveCreateElement<any>) {
        this.currentParentNode = v;
        this.mapParentNode.set(v, Object.assign({}, this));
    }

    constructor(public data: any) { }

    addListener(contextParent: ReactiveCreateElement<any>, fun: Function) {
        this.listeners.set(contextParent, fun);
    }

    addProxySelf(proxy: State) {
        this.proxySelf = proxy;
    }

    set(newValue: any) {
        this.oldData = this.data;
        this.data = newValue;
        this.mapParentNode.forEach((state, parent) => parent.render(true, state, this.oldData)
        );
    }

    $setReturnData(value: any) {
        this.nwdata = value;
    }

    toString() {
        return this.getAndResetData()?.toString() ?? "";
    }

    private getAndResetData() {
        const data = this.nwdata ?? this.data;
        this.nwdata = undefined;
        return data;
    }

    [Symbol.toPrimitive]() {
        return this.toString();
    }

    *[Symbol.iterator]() {
        for (const iterator of this.data) {
            yield iterator;
        }
    }
}
