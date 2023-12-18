import type { IWidget } from "./contracts";
import {
    TreeWidget,
    TreeWidgetOfType,
    TypeChildNode,
    ReactivePropsWithChild,
} from "./TreeWidget";

let widgedHelper: IWidget;

/**
 * añade un objeto que representa el manejo del nodo: crear, añadir, actualizar, eliminar y seleccionar
 *
 * @param widget adds an object that represents the handling of the node: create, add, update, delete and select
 */
export function addWidgetHelper(helper: IWidget) {
    widgedHelper = helper;
}

/**
 * clase estatica de creación
 *
 * static class of creation
 */
export class Reactive {
    /**
     *
     * @param elements tree childs
     * @returns
     */
    static Fragment<TypeWidget = any>({
        children,
    }: ReactivePropsWithChild): TypeChildNode[] {
        return children;
    }

    /**
     * crear la interfaz del nodo
     *
     * create node interface
     *
     * @param type type element jsx
     * @param properties properties received jsx
     * @param childs tree childs
     * @returns
     */
    static createElement<TypeWidget = any>(
        type: TreeWidgetOfType<TypeWidget>,
        properties: Record<string, any>,
        ...childs: TypeChildNode[]
    ): TreeWidget<TypeWidget> {
        const treeWidget = Object.seal(
            new TreeWidget(type, properties || {}, widgedHelper, childs)
        );
        treeWidget.createNodeAndChilds();
        return treeWidget;
    }
}

/**
 * encargada de renderizar todo el árbol de la aplicación
 *
 * in charge of rendering the entire application tree
 *
 * @param root root element
 * @param component component to render
 * @returns
 */
export function render<TypeWidget = any>(
    root: string,
    component: TreeWidget<TypeWidget>
) {
    component.node = widgedHelper.querySelector(root);
    component.render();
    return component;
}
