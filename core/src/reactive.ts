import type {
    IWidget,
    IWidgetUpdate,
    ReactiveCreateElement,
    ReactiveCreateElementOfType,
    IStoreState,
    TypeElement,
    ReactiveProps,
} from "./contracts";
import { Execute } from "./useState";
import { State } from "./State";
import { TreeWidget } from "./TreeWidget";

let widgedHelper: IWidget;

function toArray<TypeWidget = any>(
    data: TypeElement<TypeWidget> | TypeElement<TypeWidget>[]
) {
    return Array.isArray(data) ? data : [data];
}

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
    static Fragment<TypeWidget = any>(
        {children}: ReactiveProps<any, TypeWidget>
    ): TypeElement<TypeWidget>[] {
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
        type: ReactiveCreateElementOfType<TypeWidget>,
        properties: Record<string, any>,
        ...childs: TypeElement<TypeWidget>[]
    ): ReactiveCreateElement<TypeWidget> {
        const treeWidget = Object.seal(new TreeWidget(type, properties, widgedHelper));
   
        const shareContext = treeWidget.properties?.shareContext;

        if (shareContext) {
            treeWidget.sharedContext.set(shareContext.id, shareContext.ref);
            delete treeWidget.properties.shareContext;
        }

        //setParent(childs);

        if (typeof type === "string") {
            treeWidget.node = widgedHelper.createWidget(type);
            treeWidget.childs = toArray(childs);
            //widgedHelper.setProperties(def.node, properties);
        } else if (typeof treeWidget.type === "function") {
            const child =
                type.name === "Fragment"
                    ? treeWidget.type({children: childs})
                    : treeWidget.type.call(
                          treeWidget,
                          Object.assign(properties ?? {}, {children: childs}),
                          childs
                      );
            treeWidget.childs = toArray(child);
            //setParent(treeWidget.childs);
        }

        function setParent(childs: TypeElement<TypeWidget>[]) {
            childs.forEach((child) => {
                if (typeof child === "object") {
                    //if (!child.parentNode)
                    child.parentNode = treeWidget;
                }
            });
        }

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
    component: ReactiveCreateElement<TypeWidget>
) {
    console.log(component);

    component.node = widgedHelper.querySelector(root);
    component.render();
    return component;
}
