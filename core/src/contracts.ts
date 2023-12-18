import { StateAction } from "./State";
import { TreeWidget } from "./TreeWidget";

export type TextWidget = { text: any } & Record<string, any>;

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
    resetWidgets?: (widgets: TypeWidget[]) => void;
    setText(widget: TypeWidget, str: string): void;
    createText(str: string | number | boolean): TypeWidget | Text;
    createWidget(type: string, ns: boolean): SVGElement | TypeWidget;
    appendWidget(
        parent: TypeWidget,
        childWidget: TypeWidget | TypeWidget[]
    ): void;
    setProperties(parent: TypeWidget, props: Record<string, any>): void;
    querySelector(selector: string): TypeWidget;
    updateWidget(updateInfo: IWidgetUpdate<TypeWidget>): void;
    replaceChild(
        widgetParent: TypeWidget,
        newWidget: TypeWidget[],
        oldWidget: TypeWidget[]
    ): void;
}

export interface IMapListeners extends Map<any, any>, Pick<string, any> {
    [key: string]: any;
}

export interface ICallbackContext {
    ctx: TreeWidget<any>;
}