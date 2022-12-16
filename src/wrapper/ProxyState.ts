class ProxyState {
    constructor(public data: unknown) {}
}

export default (data: unknown) => {
    return new Proxy(new ProxyState(data), {
        get(target, p, receiver) {
           return target.data[p];
        },
        set(target, p, value, receiver) {
            target.data[p] = value;
            return true;
        },
        getPrototypeOf() {
            return ProxyState.prototype;
        },
    })
}