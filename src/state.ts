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

const state = new Map<number, State[]>();

class State {
    recall: boolean = false;
    update: boolean = false;

    oldValue: unknown;
    constructor(
        public context: IComponentGeneral,
        public value: unknown,
        public id: number = 0
    ) {
        this.oldValue = value;
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
        | ValueString;

    if (Array.isArray(data)) {
        value = new ValueArray(data);
    } else if (data instanceof Object) {
        value = new ValueObject(data);
    } else if (typeof data === "string") {
        value = new ValueString(data);
    } else if (typeof data === "number") {
        value = new ValueNumber(data);
    } else if (typeof data === "boolean") {
        value = new ValueBoolean(data);
    }

    let lastState: State;

    if (!state.has(context.id)) {
        state.set(context.id, []);
    }

    const allState = state.get(context.id);

    if (allState.some((state) => state.update)) {
        lastState = allState.find((state) => !state.recall);
        lastState.recall = true;
    } else {
        allState.push((lastState = new State(context, data)));
        //allState.push((lastState = new State(context, data)));
    }

    const dispatcher = (nwValue: unknown) => {
        lastState.update = true;
        lastState.value = nwValue;

        console.log(context, value);

        const oldResultNode = context.resultNode;
        const rerender = lastState.context.render();

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

    return [lastState.value as T, dispatcher];
}

export async function useEffect(fn: () => void) {
    fn();
}
