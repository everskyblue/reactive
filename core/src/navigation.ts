import {
    TreeNative,
    ReactivePropsWithChild,
    _onUpdate
} from "./TreeNative";
import { exec, useState, createState } from "./hooks";
import { mergeProperties } from "./utils";

interface RouteProps {
    cache?: boolean;
    path: string;
    render: TreeNative<any>;
}

let capture: {path: string, params: {[key: string]: string}};

export const createNavigationState = ()=> createState({
    path: '',
    setPath(path: string) {
        this.path = path;
    }
});

const component = (children: TreeNative[]) => children.find(child => findRoute(child.properties as any));

function findRoute({ path }: RouteProps) {
    const hash =
        location.hash.length && location.hash.startsWith("#")
            ? location.hash.slice(1)
            : "/";
    const pattern = new globalThis.URLPattern(path, location.origin);
    const match = pattern.exec(hash, location.origin);
    capture = match ? {path: match.input, params: match.groups} : null;
    return capture !== null;
}

export function Routes({
    children,
    notFount,
    state
}: ReactivePropsWithChild<any>) {
    const invoke = useState(false);
    const routeState = useState(!invoke.value ? component(children)??notFount : null, true);
    
    exec(() => {
        window.addEventListener("hashchange", () => {
            if (invoke.value === false) invoke.set(true);
            const route = component(children) ?? notFount
            const findRoute = routeState.currentStoreState.store.some(child => child === route);
            if (findRoute && route.properties.cache === false) {
                const { render } = route.properties;
                route.childs = render.childs = undefined;
            }
            
            routeState.set(route);
        })
    })();
    
    if (!routeState.value.parentNode) {
        routeState.value.parentNode = this;
    }
    
    return routeState.value;
}

export function Route(props: RouteProps) {
    props.render.parentNode = this;
    if (typeof props.cache ==='undefined') props.cache = true;
    return props.render;
}

export function useParams() {
    return capture.params;
}

export function usePath() {
    return capture.path;
}
