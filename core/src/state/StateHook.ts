import { State } from "../State";
import { ReactiveCreateElement } from "../contracts";

export class StateHook<TypeWidget = any> {
    isStateHandler: boolean = true;
    parentNode: ReactiveCreateElement<TypeWidget>;
    constructor(private state: State){}
}