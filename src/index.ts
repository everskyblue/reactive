import { ComponentDOM } from "./wrapper/ComponentDOM";
import { ComponentFragment } from "./wrapper/ComponentFragment";
import { ComponentJSX } from "./wrapper/ComponentJSX";
import IComponentDOM from "./contracts/IComponentDOM";
import IComponentFragment from "./contracts/IComponentFragment";
import IComponentJSX from "./contracts/IComponentJSX";
import { CallbackComponent, IComponentGeneral, IGeneral, IObjectGeneral } from "./contracts/IElement";
import { factory, setObjectCreateElement } from "./factory";
import AbstractComponent from "./wrapper/AbstractComponent";

export { setObjectCreateElement };

export default class Reactive {
    static Fragment({
        children,
    }: {
        children: (IComponentDOM | IComponentJSX | IObjectGeneral)[];
    }) {
        return new ComponentFragment(children);
    }

    static createElement(
        tag: IObjectGeneral | CallbackComponent,
        attrs: Pick<string, any> | null,
        ...children: IGeneral[]
    ): AbstractComponent {
        const props = attrs ?? {};
        if (typeof tag === "function") {
            if (tag.toString() === Reactive.Fragment.toString()) {
                //@ts-ignore
                return tag({ children }) as IComponentFragment;
            }
            return new ComponentJSX(tag, props, children);
        }

        return new ComponentDOM(tag as string, props, children);
    }

    static invokableComponent(component: ComponentJSX) {
        return component.invokeComponent();
    }

    static async iterateFragment(
        iterable: IComponentFragment[]
    ): Promise<IObjectGeneral[]> {
        const mapComponent = iterable.map((component) => {
            return Reactive.factory(component);
        });
        return await Promise.all(mapComponent) as IObjectGeneral[];
    }

    static async factory(component: IComponentGeneral | IComponentGeneral[]) {
        return factory(component);
    }
}
