import { StateAction, StateRender } from "./State";
import { recursive, getNodeWidgetChild } from "./utils";
import { TreeWidget, NativeRender as INativeRender } from "./TreeWidget";

type Element = SVGElement | HTMLElement;

const isNativeWindow = typeof window !== 'undefined';

export class NativeRender implements INativeRender {
    resetWidgets = (widgets: Element[]) => {
        for (const element of widgets) {
            element.innerHTML = "";
        }
    };

    createWidget(type: string, ns: boolean): Element {
        return ns
            ? document.createElementNS("http://www.w3.org/2000/svg", type)
            : document.createElement(type);
    }

    appendWidget(parent, nativeChild): void {
        if (isNativeWindow) {
            if (typeof nativeChild.type === 'function') return;
            const parentNode = parent.getNodeWidget();
            const nodes = nativeChild instanceof TreeWidget ? getNodeWidgetChild(nativeChild) : nativeChild instanceof StateRender ? nativeChild.node.map(recursive) : nativeChild;
            if (Array.isArray(nodes))
                parentNode.node.append(...nodes);
            else
                parentNode.node.append(nodes);
        }
    }

    setProperties(parent: Element, props: Record<string, any>): void {
        for (const key in props) {
            const value = props[key];
            if (key.startsWith("on")) {
                parent.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                parent.setAttribute(
                    key === "className" ? "class" : key,
                    String(value)
                );
            }
        }
    }

    querySelector(selector: string): Element {
        return document.querySelector(selector);
    }

    updateWidget(render): void {
        const nodeParent = render.getNodeParent();
        let { index, oldChilds, newChilds } = render;
        if (typeof newChilds === 'string') {
            nodeParent.childNodes.item(index).data = newChilds;
        } else {
            newChilds = newChilds.map(child => recursive(child)).flat();
            oldChilds = oldChilds.map(child => recursive(child)).flat();
            const isMayor = newChilds.length > oldChilds.length;
            for (let index = 0; index < newChilds.length; index++) {
                const element = newChilds[index];
                if (oldChilds[index]) oldChilds[index].replaceWith(element);
                else nodeParent.insertBefore(element, newChilds[index - 1]?.nextSibling);
            }

            (!isMayor && newChilds.length !== oldChilds.length && oldChilds.slice(newChilds.length).forEach(element => {
                element.remove();
            }));
        }
    }
}
