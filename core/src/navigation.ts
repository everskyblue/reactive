import type {
    TreeNative,
    ReactivePropsWithChild,
} from "./TreeNative";
import { exec, useState } from "./hooks";

interface RouteProps {
    path: string;
    render: TreeNative<any>;
}

let capture: {path: string, params: {[key: string]: string}};

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
}: ReactivePropsWithChild<any>) {
    const invoke = useState(false);
    const routeState = useState(!invoke.value ? component(children)??notFount : null, true);
    
    exec(() => {
        window.addEventListener("hashchange", () => {
            if (invoke.value === false) invoke.set(true);
            routeState.set(component(children) ?? notFount);
        })
    })();
    
    if (!routeState.value.parentNode) {
        routeState.value.parentNode = this;
    }
    
    return routeState.value;
}

export function Route(props: RouteProps) {
    props.render.parentNode = this;
    return props.render;
}

export function useParams() {
    return capture.params;
}

export function usePath() {
    return capture.path;
}
