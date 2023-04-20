import type { IWidget, TextWidget } from "./contracts";
import { StateAction } from "./State";

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

export class WidgetHelper implements IWidget<HTMLElement> {
    replaceChild(newWidget: HTMLElement[], oldWidget: HTMLElement[]): void {
        //widgetParent.replaceChildren(...newWidget)
        
        oldWidget.forEach(old => {
            old.parentElement.replaceChild(newWidget.shift(), old)
        });
        
        //console.log(newWidget, oldWidget, oldWidget.parentElement);
        
    
        /* if (e) {
            const e = widget.childNodes.item(position)
            widget.removeChild(e);
            console.log(e, widget, widget.childNodes.length);
        } */
    }

    setText(widget: HTMLElement, str: string): void {
        widget.textContent = str;
    }

    createText(str: string) {
        return new ReactiveText(str);
    }

    createWidget(type: string): HTMLElement {
        return document.createElement(type);
    }

    appendWidget(
        parent: HTMLElement,
        childWidget: HTMLElement | HTMLElement[]
    ): void {
        //console.log(childWidget, "7", parent);
        parent.append(
            ...(Array.isArray(childWidget) ? childWidget : [childWidget])
        );
    }

    setProperties(parent: HTMLElement, props: Record<string, any>): void {
        for (const key in props) {
            const value = props[key];
            if (key.startsWith("on")) {
                parent.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                parent.setAttribute(key, String(value));
            }
        }
    }

    querySelector(selector: string): HTMLElement {
        return document.querySelector(selector);
    }

    updateWidget(info): void {
        const childNodes = info.node.childNodes;
        const element = childNodes.item(info.updateIndex) as any;
        const previous = element?.previousSibling;

        if (info.isStringable) {
            return (element.data = info.state);
        }

        const elements = Array.from(childNodes)
            .slice(info.updateIndex)
            .slice(0, info.totalChilds) as HTMLElement[];
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
