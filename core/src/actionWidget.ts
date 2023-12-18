import type { IWidget, IWidgetUpdate, TextWidget } from "./contracts";
import { StateAction } from "./State";

type Element = SVGElement | HTMLElement;

function toStringObject(value: any) {
    let str = '';

    for (const key in value) {
        //
    }

    return str;
}

export class ReactiveText extends Text implements TextWidget {
    constructor(text: any) {
        super(text);
    }

    public get text(): string {
        return this.data;
    }

    public set text(v: string) {
        this.data = v;
    }
}

export class WidgetHelper {
    resetWidgets = (widgets: Element[]) => {
        for (const element of widgets) {
            element.innerHTML = '';
        }
    }

    replaceChild(
        widgetParent: Element,
        newWidget: Element[],
        oldWidget: Element[]
    ): void {
        if (newWidget.length === oldWidget.length) {
            oldWidget.forEach((node, index) => {
                node.replaceWith(newWidget[index]);
            });
        } else if (oldWidget.length === 1) {
            oldWidget.at(0).replaceWith(...newWidget);
        } else {
            let next = oldWidget.at(-1).nextSibling;
            oldWidget.forEach((node) => node.remove());
            newWidget.forEach((nwnode) => {
                widgetParent.insertBefore(nwnode, next);
            });
            //widgetParent.replaceChildren(...newWidget);
        }
    }

    setText(widget: Element, str: string): void {
        widget.textContent = str;
    }

    createText(str: string) {
        return new ReactiveText(str);
    }

    createWidget(type: string, ns: boolean): Element {
        return ns ? document.createElementNS('http://www.w3.org/2000/svg', type) : document.createElement(type);
    }

    appendWidget(
        parent: Element,
        childWidget: Element | Element[]
    ): void {
        parent.append(
            ...(Array.isArray(childWidget) ? childWidget : [childWidget])
        );
    }

    setProperties(parent: Element, props: Record<string, any>): void {
        for (const key in props) {
            const value = props[key];
            if (key.startsWith("on")) {
                parent.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                parent.setAttribute(key === 'className' ? 'class' : key, String(value));
            }
        }
    }

    querySelector(selector: string): Element {
        return document.querySelector(selector);
    }

    updateWidget(info: IWidgetUpdate<Element>): void {
        const childNodes = info.node.childNodes;
        const element = childNodes.item(info.updateIndex) as any;
        const previous = element?.previousSibling;

        if (!info.state) return;

        if (info.isStringable) {
            return (element.data = info.state);
        }

        const elements = Array.from(childNodes)
            .slice(info.updateIndex)
            .slice(0, info.totalChilds) as Element[];
        const next = elements.at(-1)?.nextSibling;

        if (info.typeAction === StateAction.NEW) {
            for (let position = 0; position < elements.length; position++) {
                elements[position].remove();
            }
            if (childNodes.length === 0 || (!element && !previous && !next)) {
                return info.node.append(...info.state);
            }

            if (element.parentNode) {
                return element.before(...info.state);
            }

            if (next && !element.parentNode) {
                return next.before(...info.state);
            }

            previous.after(...info.state);
        } else if (info.typeAction === StateAction.UPDATE) {
            info.node.append(...info.state);
        }
    }
}
