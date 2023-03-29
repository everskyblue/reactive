export type TextWidget = { text: any } & Record<string, any>;

export type TypeElement<AnyWidget = any> =
    | string
    | boolean
    | number
    | AnyWidget;

export interface IWidgetUpdate<TypeWidget> {
    isStringable: boolean;
    node: TypeWidget;
    typeAction: StateAction;
    state: any;
    updateIndex: number;
    totalChilds: number;
}

export interface IWidget<TypeWidget = any> {
    setText(widget: TypeWidget, str: string): void;
    createText(str: string): TypeWidget | Text;
    createWidget(type: string): TypeWidget;
    appendWidget(
        parent: TypeWidget,
        childWidget: TypeWidget | TypeWidget[]
    ): void;
    setProperties(parent: TypeWidget, props: Record<string, any>): void;
    querySelector(selector: string): TypeWidget;
    updateWidget(updateInfo: IWidgetUpdate<TypeWidget>): void;
}

export type ReactiveCreateElementOfType<AnyWidget> = 
    string
    | ((
          props: Record<string, any>
      ) =>
          | ReactiveCreateElement<AnyWidget>
          | ReactiveCreateElement<AnyWidget>[]);//TypeElement<AnyWidget> | TypeElement<AnyWidget>[]

export interface ReactiveCreateElement<AnyWidget> {
    type: ReactiveCreateElementOfType<AnyWidget>;
    node: AnyWidget;
    parentNode: ReactiveCreateElement<AnyWidget>; //ReactiveCreateElementOfType<AnyWidget>;
    properties: Record<string, any>;
    childs:
        | ReactiveCreateElement<AnyWidget>
        | ReactiveCreateElement<AnyWidget>[];
    render(isUpdate?: boolean, storeState?: StoreState, oldDataState?: any): AnyWidget;
    getParentNode(): () => AnyWidget;
}

export declare enum StateAction {
    CREATE = 0,
    NEW = 1,
    UPDATE = 2,
    PREPEND = 3,
}

export class StoreState {
    TYPE_ACTION: StateAction;
    rendering: ReactiveCreateElement<any>[];
    //private _current;
    //private store;
    parentNode: ReactiveCreateElement<any>;
    constructor(data: any, TYPE_ACTION?: StateAction);
    set data(v: any);
    get data(): any;
    get previousData(): any;
}
export class State implements Record<string, any> {
    data: any;
    ACTION_TYPE: StateAction;
    proxySelf: State;
    oldData: any;
    nwdata: any;
    currentParentNode: ReactiveCreateElement<any>;
    currentStoreState: StoreState;
    store: Map<ReactiveCreateElement<any>, StoreState>;
    private readonly _listParentNode;
    private readonly _mapParentNode;
    get mapParentNode(): Map<ReactiveCreateElement<any>, State>;
    get parentNode(): ReactiveCreateElement<any>;
    set parentNode(parent: ReactiveCreateElement<any>);
    constructor(data: any);
    addProxySelf(proxy: State): void;
    set(newValue: any): void;
    append(...values: any[]): void;
    invokeNode(): void;
    $setReturnData(value: any): void;
    is(value: any): boolean;
    toString(): any;
    private getAndResetData;
    [Symbol.toPrimitive](): any;
    [Symbol.iterator](): Generator<any, void, unknown>;
}