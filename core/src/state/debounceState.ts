import type { TreeNative } from "../TreeNative";
import State from "./InfoState";
import { debounce } from "../utils";

const debounceState = (() => {
    let call: [State.InformationDesk, State.Value];
    let all = [];
    let invokeThis = new Set<[State.InformationDesk, State.Value]>();

    const caller = debounce(() => {
        if (invokeThis.size === 0) {
            for (const [infoDesk, proxy] of all) {
                const stores = Array.from(proxy._store.values());
                //proxy._store.clear();
                //console.log(infoDesk);
                for (const treeNative of stores) {
                    treeNative.$update(false, proxy);
                }
            }
            all = [];
        }
        
        if (invokeThis.size > 0) {
            for (const [infoDesk, proxy] of invokeThis.values()) {
            //console.log(infoDesk.component,proxy);
                infoDesk.component.$update(true, proxy);
            }
            invokeThis.clear();
        }
        
    }, 100);

    return (infoDesk: State.InformationDesk, proxy: State.Value) => {
        all.push([infoDesk, proxy]);
        if (infoDesk.invokeCtx ) {
            if (!Array.from(invokeThis.values()).some(([info])=> info.component.type == infoDesk.component.type))invokeThis.add([infoDesk, proxy])
        }
        //console.log(infoDesk, proxy);
        caller();
    }
})();

export default debounceState;