import { IComponentGeneral } from "./contracts/IElement";
import {
    ValueArray,
    ValueBoolean,
    ValueNumber,
    ValueObject,
    ValueString,
} from "./wrapper/ValueState";
import proxyState, { ProxyState } from "./wrapper/ProxyState";
import render from "./render";


const state = new Map<number, Array<any>>();
const fetchData = new Map<number, ()=> any>();

export class State {
    recall: boolean = false;
    update: boolean = false;
    parent: any;
    nwValue: unknown;
    constructor(
        public context: IComponentGeneral,
        public value: unknown,
        public id: number = 0
    ) {
        
    }
    [Symbol.toPrimitive]() {
        return this.toString();
    }

    toString() {
        return this.nwValue ?? this.value;
    }
}

export function useState<T>(
    data: T,
    context: IComponentGeneral
): [T, (data: T) => any] {
    if (
        (data instanceof Array ||
            data instanceof Object ||
            typeof data === "string" ||
            typeof data === "number" ||
            typeof data === "boolean") === false
    ) {
        throw new Error("value no valid");
    }

    let lastState: ProxyState;

    if (!state.has(context.id)) {
        state.set(context.id, []);
    }

    const allState = state.get(context.id);

    if (allState.some((state) => state.update)) {
        lastState = allState.find((state) => !state.recall);
        lastState.recall = true;
    } else {
        allState.push((lastState =  proxyState(data)));
    }
    //console.log(lastState);
    
    const dispatcher = (nwValue: unknown) => {
        lastState.update = true;
        lastState.value = typeof nwValue === 'function' ? nwValue() : nwValue;;
        lastState.__data = lastState.value;
        console.log(lastState, context);
        
        if (!lastState.parent) {
            let oldResultNode = context.resultNode;
            context.render()
            oldResultNode.parentNode.replaceChild(
                context.resultNode,
                oldResultNode
            )
        } else {
            let oldResultNode = lastState.parent.resultNode;
            lastState.parent.render();
            oldResultNode.parentNode.replaceChild(
                lastState.parent.resultNode,
                oldResultNode
            )
        
        }

        allState.forEach((state) => {
            state.recall = state.update = false;
        });
        
        /*const oldResultNode = context.resultNode;
        const rerender = context.render()

        console.log(
            rerender,
            oldResultNode.parentNode.replaceChild(
                context.resultNode,
                oldResultNode
            )
        );*/
    };

    return [lastState as unknown as T, dispatcher];
}


export function useFetch(callback: ()=> void, context: IComponentGeneral) {
    if (fetchData.has(context.id)) return false;
    fetchData.set(context.id, callback);
    callback();
}