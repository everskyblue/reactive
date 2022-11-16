import { addParent } from "./add-parent";
import {
    TCallbackComponent,
    TCJSXParams,
    TReturnComponent,
    DComponentJSX,
    TUseStateComponent,
    DStateComponent,
} from "./contracts";
import IComponent from "./contracts/IComponent";
import IComponentJSX from "./contracts/IComponentJSX";
import { CallbackComponent, ParamsJSX } from "./contracts/IElement";
import { factory } from "./factory";
import { StateComponent } from "./StateComponent";

let id: number = 0;



export class ComponentJSX implements IComponentJSX {
    public readonly id: number = id++;
    public parent: IComponent;
    public data: any;
    public state: DStateComponent;
    
    constructor(public component: CallbackComponent, public params: ParamsJSX) {}

    useEffect() {
        if (typeof this.params.props.useEffect !== 'function') {
            throw new Error('useEffect is not a function');
        }

        const promise = this.params.props.useEffect();
        
        delete this.params.props.useEffect;

        return promise;
    }

    existsUseEffect() {
        return 'useEffect' in this.params.props;
    }

    invokeComponent() {
        const { children, props } = this.params;
        
        addParent(this, children);
        
        const attrs = {children, ...props}
        const childs = this.component(attrs);
        
        if (Array.isArray(childs)) {
            addParent(this, childs);
        } else {
            childs.parent = this;
        }
        
        return childs;
    }
}
