import type { TreeNative } from "../TreeNative";

export interface IStackTicket {
    ticket: number;
    queue: Set<any>;
    reInvoke: boolean;
    map: Map<any, any>;
}

export class Stack {
    readonly queue: Set<any> = new Set();
    readonly map: Map<any, any> = new Map();
    public ticket: number = 0;
    public reInvoke: boolean = false;
}

export default () => {
    const group = new Map<any, Stack>();

    return {
        stack(keyMap: any): IStackTicket {
            if (!group.has(keyMap)) {
                group.set(keyMap, new Stack());
            }

            return group.get(keyMap);
        },
        nextTicket<Type = any>(stack: IStackTicket): Type {
            const currentValue = Array.from(stack.queue).at(stack.ticket);
            stack.ticket += 1;
            if (stack.queue.size === stack.ticket) {
                stack.ticket = 0;
            }
            return currentValue;
        }
    }
}