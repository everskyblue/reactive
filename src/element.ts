import { TElement } from "./contracts";
import { ICreateElement, IElement } from "./contracts/IElement";
function insert(childs: HTMLElement[]) {}

const create: ICreateElement<HTMLElement> = {
    createElement(tag: string): HTMLElement {
        return document.createElement(tag);
    },
    createTextNode(text: string): Text {
        return document.createTextNode(text);
    },
    mergeElement(node: HTMLElement) {
        const lastNode = node.lastChild as Text;

        return (value: string) => {
            if (lastNode) lastNode.data += value;
            return false;
        };
    },
    preInsertBefore(node: TElement<HTMLElement>, replace: boolean) {
        let lastChild = node.lastChild;

        return (child) => {
            let nextNode: HTMLElement | any = replace ? lastChild : undefined;
            (child as HTMLElement[]).forEach(
                (element: HTMLElement, index: number) => {
                    if (replace && index === 0) {
                        node.replaceChild(element, lastChild);
                    } else {
                        node.insertBefore(element, nextNode?.nextSibling);
                    }
                    nextNode = element;
                }
            );
            //node.insertBefore(child, lastChild?.nextSibling)
        };
    },
    /* selectChild(query: string, isSelectAll: boolean = false) {
        const element = document.querySelectorAll(query);
        return isSelectAll ? element as unknown as HTMLElement[] : element[0] as HTMLElement;
    } */
    resetChild(idx: number) {
        const e = document.querySelector(`[data-idx="${idx}"]`);
        e.childNodes.forEach((node: HTMLElement) => {
            if (node.hasAttribute('data-key'))
                node.remove()
        })
    },
    append(tagname: string, id: number, nwElement: IElement) {
        const oldElement = document.querySelector(`${tagname}[data-idx="${id}"]`) as HTMLElement;
        oldElement.parentElement.replaceChild(nwElement, oldElement)
    }
};

export default create;
