import { State } from "jsx/state";
import IComponentDOM from "./IComponentDOM";
import IComponentFragment from "./IComponentFragment";
import IComponentJSX from "./IComponentJSX";

export type ICreateElement<T = IElement> = {
    createElement: (tag: string) => IElement,
    createTextNode: (text: string|number|boolean) => any,
    mergeElement: (node: T) => (value: string | number | IElement)=> void,
    preInsertBefore(node: IElement, isNextNode?: boolean): (data: any) => void,
    resetChild(idx: number): void
    append(tagname: string, idx: number, nwElement: IElement): any
    //selectChild(query: string, isSelectAll?: boolean): TElement<T> | TElement<T>[]
};

export type IElement = HTMLElement;

export type ReceivedData = {
    data: any,
    useEffect?: <T>()=> ArrayLike<T> | Partial<T>,
    useState?: null
}

export type ParamsJSX = {
    props: any,
    children?: IGeneral[]
}

export type IObjectGeneral = IElement | string | number | boolean | ProxyHandler<State<any>> | Required<State<any>>;

export type IComponentGeneral = IComponentDOM | IComponentJSX | IComponentFragment;

export type IGeneral = IObjectGeneral | IComponentGeneral | ProxyFunction;

export type PropertiesComponent = Pick<string, any> & {children: IGeneral[]};

export type CallbackComponent = (props: PropertiesComponent) => IComponentGeneral | IComponentGeneral[];

interface ProxyFunction {
    (...args: string[]): [Required<State<any>>, rerun];
    parent: IComponentGeneral
}

interface rerun {
    (...args: string[]): ReRunMethods;
}

interface ReRunMethods {
    parent: IComponentGeneral
}