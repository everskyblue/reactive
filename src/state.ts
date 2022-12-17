import IComponentFragment from "./contracts/IComponentFragment";
import { IComponentGeneral } from "./contracts/IElement";
import IState from "./contracts/IState";
import { Listeners } from "./Listeners";
import render from "./render";
import AbstractComponent from "./wrapper/AbstractComponent";
import {
    ValueArray,
    ValueBoolean,
    ValueNumber,
    ValueObject,
    ValueString,
} from "./wrapper/ValueState";

const state = new Map<number, Array<any>>();

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

    //-

    let value:
        | ValueArray
        | ValueBoolean
        | ValueNumber
        | ValueObject
        | ValueString = getValue(data);

    let lastState: State;

    if (!state.has(context.id)) {
        state.set(context.id, []);
    }

    const allState = state.get(context.id);

    if (allState.some((state) => state.update)) {
        lastState = allState.find((state) => !state.recall);
        lastState.recall = true;
    } else {
        const handler: ProxyHandler<any> = {
            get(target: State, p: any, receiver) {
                if (typeof data[p] === 'function') {
                    return (...args: any[]) => {
                        //target.nwValue = data[p](...args);
                        return getValue(data[p](...args));
                    }
                }
                
                return p in target ? target[p] : p === Symbol.toPrimitive ? target : receiver;
            },
            getPrototypeOf() {
                return State.prototype;
            },
        };
    
        //allState.push((lastState = new State(context, data)));
        allState.push((lastState = new Proxy(value, handler)));
    }

    const dispatcher = (nwValue: unknown) => {
        lastState.update = true;
        lastState.value = nwValue;

        console.log(context, lastState);
        

        const oldResultNode = context.resultNode;
        const rerender = context.render();

        allState.forEach((state) => {
            state.recall = state.update = false;
        });
        
        console.log(
            rerender,
            oldResultNode.parentNode.replaceChild(
                context.resultNode,
                oldResultNode
            )
        );
    };

    return [lastState as unknown as T, dispatcher];
}

export async function useEffect(fn: () => void) {
    fn();
}
function getValue<T>(data: T): ValueArray | ValueBoolean | ValueNumber | ValueObject | ValueString {
    if (Array.isArray(data)) {
        return new ValueArray(data);
    } else if (data instanceof Object) {
        return new ValueObject(data);
    } else if (typeof data === "string") {
        return new ValueString(data);
    } else if (typeof data === "number") {
        return new ValueNumber(data);
    } else if (typeof data === "boolean") {
        return new ValueBoolean(data);
    }
}

