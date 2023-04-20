import { State } from "../State";
import { IState, ReactiveCreateElement } from "../contracts";

export class StateHook<TypeWidget = any> {
    isStateHandler: boolean = true;
    constructor(
        public parentNode: ReactiveCreateElement<TypeWidget>,
        public state: IState
    ) {}
}