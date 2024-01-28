import {
    TreeNative,
    TreeNativeOfType,
    TypeChildNode,
    ReactivePropsWithChild,
    NativeRender,
} from "./TreeNative";

let widgedHelper: NativeRender;

/**
 * añade un objeto que representa el manejo del nodo: crear, añadir, actualizar, eliminar y seleccionar
 *
 * @param widget adds an object that represents the handling of the node: create, add, update, delete and select
 */
export function addWidgetHelper(helper: any) {
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
        type: TreeNativeOfType<TypeWidget>,
        properties: Record<string, any>,
        ...childs: TypeChildNode[]
    ): TreeNative<TypeWidget> {
        const treeWidget = Object.seal(
            new TreeNative(type, properties || {}, widgedHelper, childs)
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
    component: TreeNative<TypeWidget>
) {
    component.node = widgedHelper.querySelector(root);
    component.render();
    return component;
}
