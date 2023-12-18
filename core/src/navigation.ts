import type {
    TreeWidget,
    ReactivePropsWithChild,
} from "./TreeWidget";
import { exec } from "./hooks";
import { useState } from "./hooks/useState";

interface RouteProps {
    path: string;
    render: TreeWidget<any>;
}

let capture: {path: string, params: {[key: string]: string}};

const component = (children: TreeWidget[]) => children.find(child => findRoute(child.properties as any));

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
    const invoke = useState(false, this);
    const routeState = useState(!invoke.data ? component(children) : null ?? notFount, this);
    
    exec(() => {
        this.implementStates(routeState);
        window.addEventListener("hashchange", () => {
            if (invoke.data === false) invoke.set(true);
            routeState.set(component(children) ?? notFount);
        })
    }, this)();

    if (!routeState.data.parentNode) {
        routeState.data.parentNode = this;
    }

    return routeState.data;
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
