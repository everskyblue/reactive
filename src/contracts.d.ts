export type Props<T> = {
    [K in keyof T]: T[K]
}

export type mergeNode<T> = (node: T) => (value: string | number | TElement)=> void

export type TElement<T = {}> = T & {
    append: (...args: any[])=> any,
    setAttribute: (key: string, value: any)=> any
} & Element

export type TCreateElement<T = {}> = {
    createElement: (tag: string) => TElement<T>
    createTextNode: (text: string|number) => any,
    mergeElement: mergeNode<T>,
    preInsertBefore(node: TElement<T>, isNextNode?: boolean): (data: any) => void,
    resetChild(idx: number)
    //selectChild(query: string, isSelectAll?: boolean): TElement<T> | TElement<T>[]
}

export type PropParam = Props<{
    [k: string]: unknown
}>

export type TUseStateComponent = [DStateComponent, ((value: any)=> void)];

export  type TUseProp = {
    data?: TUseStateComponent, //TReturnComponent,
    useEffect?: ()=> TUseStateComponent, //Promise<DComponentDOM | DComponentJSX>,
    useState?: (data: any) => TUseStateComponent
} & PropParam;

export type TReturnComponent = DComponentDOM | DComponentJSX | DComponentFragment;

export type ReturnArrayComponent = Array<TReturnComponent>

export type ComponentInvokeReturnValue = Promise</*ReturnArrayComponent | */TReturnComponent> | TReturnComponent | ReturnArrayComponent;

export type TCallbackComponent = (props: TUseProp)=> DComponentDOM | DComponentFragment | DComponentJSX;

export type TCJSXParams<T = TUseProp> = {
    props: T,
    children: TChildrenComponent
}

export type TComponent = DComponentDOM | DComponentJSX

export type TPrimitive = number | string;

export type TFragment = TPrimitive | TComponent | Promise<any>;

export type TChildren = TComponent|DComponentFragment|string|number|Promise<any>;

export type TChildrenComponent = TChildren[];

export type Factory = TElement | TElement[]

declare class DComponentJSX {
    public parent: any;
    public data: any;
    public state: DStateComponent;
    public readonly id: number;
    public component: TCallbackComponent;
    public params: TCJSXParams;

    useEffect(): TUseStateComponent //Promise<DComponentDOM | DComponentJSX>
    invokeComponent(): Promise<DComponentDOM | DComponentJSX> | DComponentDOM | DComponentFragment | DComponentJSX
}

declare class DComponentDOM {
    parent: any;
    public tagname: string
    public attrs: PropParam
    public children: TChildrenComponent
}

declare class DComponentFragment {
    parent: any;
    public children: (DComponentDOM | DComponentJSX | TPrimitive)[]
    resolveFragment(): (Promise<any> | DComponentDOM | DComponentJSX | string | number | TElement)[]
}

export declare class DListeners {
    stores: Function[];
    events: any;
    constructor(type: string, fn?: any);
    addListener(fn: (value: string) => void): void;
}

export declare class DStateComponent extends String {
    parent: any;
    oldValue: any;
    isAddWiget: boolean;
    isConvertValue: boolean;
    get value(): any;
    set value(val: any);
    constructor(component: DComponentJSX, value: any);
    dispatch(value: any): void;
    render(callback: Function): DStateComponent
    map<T>(fn: (currentValue: T, index: number, array: T[]) => T[]): T[][] | DStateComponent;
    toString(): any;
    getListerner(): Record<string, any>;
}