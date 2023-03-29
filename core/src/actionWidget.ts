import type { IWidget, TextWidget } from "./implements";
import { State, StateAction } from "./State";

export class ReactiveText extends Text {
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

export const createWidget: IWidget<HTMLElement> = {
    setText: function (widget: HTMLElement, str: string): void {
        widget.textContent = str;
    },
    createText: function (str: string) {
        return new ReactiveText(str);
    },
    createWidget: function (type: string): HTMLElement {
        return document.createElement(type);
    },
    appendWidget: function (
        parent: HTMLElement,
        childWidget: HTMLElement | HTMLElement[]
    ): void {
        parent.append(
            ...(Array.isArray(childWidget) ? childWidget : [childWidget])
        );
    },
    setProperties: function (
        parent: HTMLElement,
        props: Record<string, any>
    ): void {
        for (const key in props) {
            const value = props[key];
            if (key.startsWith("on")) {
                parent.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                parent.setAttribute(key, String(value));
            }
        }
    },
    querySelector(selector: string) {
        return document.querySelector(selector);
    },
    updateWidget: function (info): void {
        const childNodes = info.node.childNodes;
        const element = childNodes.item(info.updateIndex) as any;
        const previous = element?.previousSibling;

        if (info.isStringable) {
            return (element.data = info.state);
        }
        
        const elements = Array.from(childNodes)
            .slice(info.updateIndex)
            .slice(0, info.totalChilds);
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
    },
};
