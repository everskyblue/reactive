import 'string-tocapitalize'
import { DComponentJSX, DStateComponent } from './contracts';
import IComponentJSX from './contracts/IComponentJSX';
import { Listeners } from './Listeners';

export class StateComponent extends String implements DStateComponent {
    parent: any;
    oldValue: any;
    isAddWiget: boolean = false;
    isConvertValue: boolean = false;
    #history: Set<any> = new Set();
    #listener: Record<string, any> = new Listeners('value')
    renderWith: Function;

    get value(): any {
        return this.#listener.value;
    }

    set value(val: any) {
        this.#listener.value = val;
        this.#history.add(this.oldValue);
    }

    constructor(public readonly component: IComponentJSX, value: any) {
        super();
        this.value = value;
    }

    dispatch(value: any) {
        if (typeof value !== typeof this.value) {
            throw new Error("diferent types values");
        }

        // if (typeof this.oldValue == 'undefined') {
        //     console.log(this.component, value, this.oldValue);
        // }

        this.oldValue = this.value;
        this.value = value;
    }

    map<T = []>(fn: (currentValue: T, index?: number, array?: T[]) => T[]) {
        const arr: T[] = this.#getOriginalValue();
        const nwVal = arr.map(fn);
        return nwVal;
    }

    render(callback: Function) {
        this.renderWith = callback;
        return this
    }

    get length(): number {
        return this.#getOriginalValue().length;
    }

    #getOriginalValue() {
        return this.isConvertValue && typeof this.value === 'string' ? JSON.parse(this.value) : this.value;
    }

    #isAddWidget() {
        if (!this.isConvertValue && ((typeof this.value === 'string' && this.value.length) || typeof this.value === 'number')) {
            this.isAddWiget = true;
        }
    }
    /**
     * @depreacted
     * @param value 
     * @returns 
     */
    #toConvertValue(value: any) {
        const is = (value && (Array.isArray(value) || typeof value === 'object')) 
        this.isConvertValue = is;
        return is ? JSON.stringify(value) : value;
    }

    toString() {
        if (!this.isAddWiget) {
            this.isAddWiget = true;
        }

        return this.value; //this.isConvertValue ? this.#getOriginalValue() : this.value;
    }

    getListerner() {
        return this.#listener
    }
}
