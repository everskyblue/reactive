import { State } from "./State";
import { ReactiveCreateElement } from "./implements";

type ExecuteProps = {
    state: State;
    callback: (state: State, childs?: ReactiveCreateElement<any>) => any[];
};

function bind(target: State, key: string) {
    if (typeof target[key] === "function") {
        return target[key].bind(target);
    }
    return target[key];
}

export function useState<TypeData = any>(
    data?: TypeData,
    reInvokeCtx?: ReactiveCreateElement<any>
): TypeData & State {
    const proxies = new Proxy(new State(data), {
        get(target, key: string) {
            if (key in target) {
                return bind(target, key);
            } else if (key in target.data) {
                return typeof target.data[key] === "function"
                    ? (...args: any[]) => (
                          target.$setReturnData(
                              target.data[key].apply(target.data, args)
                          ),
                          proxies
                      )
                    : proxies;
            } else {
                throw new Error("error proxy " + key);
            }
        },
        set(target, key, newValue) {
            if (key in target) {
                target[key] = newValue;
            } else if (key in target.data) {
                target.data[key] = newValue;
            } else {
                return false;
            }
            return true;
        },
    }) as TypeData & State;

    proxies.addProxySelf(proxies);

    return proxies;
}

export function Execute(
    { state, callback }: ExecuteProps,
    childs: ReactiveCreateElement<any>
) {
    return callback(state, childs);
}
