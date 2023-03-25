import { IWidget, TextWidget } from "./implements";
import { State } from "./State";

//const TextExtend = globalThis.Text ? globalThis.Text : String;

class TextMain extends Text {
    constructor(text: any) {
        super(text)
    }
    
    public get text() : string {
        return this.data;
    }
    
    
    public set text(v : string) {
        this.data = v;
    }
}

export const createWidget: IWidget<HTMLElement> = {
    setText: function (widget: HTMLElement, str: string): void {
        widget.textContent = str;
    },
    createText: function (str: string) {
        return new TextMain(str);
    },
    createWidget: function (type: string): HTMLElement {
        return document.createElement(type);
    },
    appendWidget: function (parent: HTMLElement, childWidget: HTMLElement | HTMLElement[]): void {
        parent.append(...(Array.isArray(childWidget) ? childWidget : [childWidget]));
    },
    setProperties: function (parent: HTMLElement, props: Record<string, any>): void {
        for (const key in props) {
            const value = props[key];
            if (key.startsWith('on')) {
                parent.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                parent.setAttribute(key, String(value));
            }
        }
    },
    querySelector(selector: string) {
        return document.querySelector(selector);
    },
    updateWidget: function (isStringable: boolean, node: HTMLElement, state: State & any, updateIndex: number, totalChilds: number): void {
        const childNodes = node.childNodes;
        const element = childNodes.item(updateIndex) as any;

        if (isStringable) {
            element.data = state.proxySelf;
        } else {
            const elements = Array.from(childNodes).slice(updateIndex);
            console.log(state);
            
            if (childNodes.length === 0) {
                node.append(...state);
            } else {
                element.before(...state);
            }
            for (let position = 0; position < elements.length; position++) {
                if (position > totalChilds) break;
                elements[position].remove();
            }
        }

        //console.log(element);
    }
}