export type TextWidget = { text: any } & Record<string, any>;

/**
 * tipos de datos de que puede tener el arbol de component
 *
 * types of data that the component tree can have
 */
export type TypeElement<AnyWidget = any> =
    | string
    | boolean
    | number
    | IState
    | ReactiveCreateElement<AnyWidget>;

/**
 * parametros que recibe cuando el estado cambia de valor
 * controla cada elemento si se añade o se elimina del vista
 *
 * parameters that it receives when the state changes
 * its value control each element if it is added or removed from the view
 */
export interface IWidgetUpdate<TypeWidget> {
    isStringable: boolean;
    node: TypeWidget;
    typeAction: StateAction;
    state: any;
    updateIndex: number;
    totalChilds: number;
}

/**
 * interface para el manejo y controlar de la aplicacion
 * se llama cuando se va a renderizar el component
 *
 * interface for managing and controlling the application is called
 * when the component is going to be rendered
 */
export interface IWidget<TypeWidget = any> {
    setText(widget: TypeWidget, str: string): void;
    createText(str: string|number|boolean): TypeWidget | Text;
    createWidget(type: string): TypeWidget;
    appendWidget(
        parent: TypeWidget,
        childWidget: TypeWidget | TypeWidget[]
    ): void;
    setProperties(parent: TypeWidget, props: Record<string, any>): void;
    querySelector(selector: string): TypeWidget;
    updateWidget(updateInfo: IWidgetUpdate<TypeWidget>): void;
    replaceChild(widgetParent: TypeWidget, newWidget: TypeWidget[], currentWidgets: TypeWidget[]): void;
}

/**
 * type de valores de las etiquetas jsx
 *
 * jsx tag values type
 */
export type ReactiveCreateElementOfType<AnyWidget> =
    | string
    | ((
          props: Record<string, any>,
          childs?: TypeElement<AnyWidget>
      ) =>
          | ReactiveCreateElement<AnyWidget>
          | ReactiveCreateElement<AnyWidget>[]); //TypeElement<AnyWidget> | TypeElement<AnyWidget>[]

/**
 * arbol de informacion jsx
 *
 * jsx info tree
 */
export interface ReactiveCreateElement<AnyWidget> {
    isReInvoke: boolean;
    sharedContext: Map<string | number, any>;
    type: ReactiveCreateElementOfType<AnyWidget>;
    node: AnyWidget;
    parentNode: ReactiveCreateElement<AnyWidget>; //ReactiveCreateElementOfType<AnyWidget>;
    properties: Record<string, any> & {
        shareContext?: { id: string | number; ref: any };
    };
    childs: TypeElement<AnyWidget>[];
    render(
        isUpdate?: boolean,
        storeState?: IStoreState,
        oldDataState?: any
    ): AnyWidget | ReactiveCreateElement<AnyWidget> | void;
    getParentNode(): ReactiveCreateElement<AnyWidget>; // () => AnyWidget;
    getSharedContext(id: string): any;
}

/**
 * tipos de estados
 *
 * type state
 */
export declare enum StateAction {
    CREATE = 0,
    NEW = 1,
    UPDATE = 2,
    PREPEND = 3,
}

/**
 * almacena cada actualizacion de estado
 *
 * stores each status update
 */
export interface IStoreState {
    TYPE_ACTION: StateAction;
    rendering: ReactiveCreateElement<any>[];
    parentNode: ReactiveCreateElement<any>;
    superCtx?: ReactiveCreateElement<any>;
    set data(v: any);
    get data(): any;
    get previousData(): any;
}

/**
 * controla el estado y la vista
 *
 * controls state and view
 */
export interface IState extends Record<string, any> {
    proxySelf: IState;
    currentParentNode: ReactiveCreateElement<any>;
    currentStoreState: IStoreState;
    store: Map<ReactiveCreateElement<any>, IStoreState>;
    get parentNode(): ReactiveCreateElement<any>;
    set parentNode(parent: ReactiveCreateElement<any>);
    get data(): any;
    set data(v: any);
    set(newValue: any): void;
    addProxySelf(proxy: IState): void;
    append(values: any[]): void;
    invokeNode(): void;
    $setReturnData(value: any): void;
    is(value: any): boolean;
    toString(): string;
    [Symbol.toPrimitive](): any;
    [Symbol.iterator](): Generator<any, void, unknown>;
}
