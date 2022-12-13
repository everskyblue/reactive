import IComponentDOM from "jsx/contracts/IComponentDOM";
import IState from "jsx/contracts/IState";
import render, { processor } from "jsx/render";
import { addParent } from "../add-parent";
import { DStateComponent } from "../contracts";
import IComponent from "../contracts/IComponent";
import IComponentJSX from "../contracts/IComponentJSX";
import {
    CallbackComponent,
    IGeneral,
    ParamsJSX,
    PropertiesComponent,
} from "../contracts/IElement";
import AbstractComponent from "./AbstractComponent";

export class ComponentJSX extends AbstractComponent implements IComponentJSX {
    public data: any;

    /*useEffect() {
        if (typeof this.props.useEffect !== 'function') {
            throw new Error('useEffect is not a function');
        }

        const promise = this.props.useEffect();
        
        delete this.props.useEffect;

        return promise;
    }*/

    existsUseEffect() {
        return "useEffect" in this.props;
    }

    invokeComponent() {
        addParent(this, this.children);
        const childs = (this.jsxprocessor as CallbackComponent)({
            ...this.props,
            children: this.children,
        } as PropertiesComponent);

        addParent(this, Array.isArray(childs) ? childs : [childs]);

        return childs;
    }

    render() {
        const children = processor(this.invokeComponent());
        this.resultNode = children;
        return children;
    }
}
