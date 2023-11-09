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

function hashChange(routes: RouteProps[]) {
    for (const route of routes) {
        const hash =
            location.hash.length && location.hash.startsWith("#")
                ? location.hash.slice(1)
                : "/";
        if (route.path === hash) return route.render;
    }
}

export function Routes({
    children,
    sharedContext
}: ReactivePropsWithChild<any>) {
    const routes: RouteProps[] = children.map(
        (child: TreeWidget<any>) =>
            child.properties as unknown as RouteProps
    );
    const routeState = useState(hashChange(routes), this);
    
    if (sharedContext && !routeState.data.properties.sharedContext) {
        routeState.data.properties.sharedContext = {};
        for (const key in sharedContext) {
            routeState.data.properties.sharedContext[key] = sharedContext[key];
        }
    }

    exec(() => {
        this.implementStates(routeState);
        window.addEventListener("hashchange", () => {
            const route = hashChange(routes);
            routeState.set(route ?? "page not fount");
        }
    )}, this)();


    return routeState.data;
}

export function Route(props: RouteProps) {
    props.render.parentNode = this;
    return props.render;
}
