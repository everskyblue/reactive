export type TextWidget = { text: any } & Record<string, any>;

export type TypeElement<AnyWidget = any> =
    | string
    | boolean
    | number
    | AnyWidget;

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
    updateWidget(isStringable: boolean, node: TypeWidget, state: any, updateIndex: number, totalChilds: number): void;
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
    render(isUpdate?: boolean, cloneState?: any, oldDataState?: any): AnyWidget;
    onUpdateState(state: any): () => void;
}
