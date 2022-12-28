import { addParent } from "jsx/add-parent";
import IComponentDOM from "jsx/contracts/IComponentDOM";
import { ICreateElement, IElement, IGeneral } from "jsx/contracts/IElement";
import { getCreatedWidget, processor } from "jsx/render";
import { State } from "jsx/state";
import AbstractComponent from "./AbstractComponent";


export class ComponentDOM extends AbstractComponent implements IComponentDOM {
    render(): IElement {
        this.children.forEach((child, index) => {
            //console.log(child);
            
        });
        const widget: ICreateElement = getCreatedWidget();
        const e = this.resultNode = widget.createElement(this.tagname);
        
        const childs = processor(this.children).flat(1);
        //console.log(e, this);
        
        for (const key in this.props) {
            const valueProp = this.props[key] as any;
            if (/^on[A-Z]/.test(key)) {
                e.addEventListener(
                    key.slice(2).toLowerCase(),
                    valueProp as () => void
                );
            } else {
                e.setAttribute(key, valueProp);
            }
        }
        
        addParent(this, this.children);
        //console.log(childs);
        e.append(...childs)

        return e;
    }

    public get attrs() : Record<string, any> {
        return this.props;
    }
    
    public get tagname() : string {
        return this.jsxprocessor as string;
    }
}
