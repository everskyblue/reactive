
export class ValueString extends String {
    parent: any = null
    constructor($value: string) {
        super($value)
    }
}

export class ValueNumber extends Number {
    parent: any
    constructor($value: number) {
        super($value)
    }
}

export class ValueArray extends Array {
    parent: any
    constructor($values: number | any[]) {
        if (Array.isArray($values)) 
            super(...$values)
        else 
            super($values)
    }

    static get [Symbol.species]() {
        return Array;
    }
}

export class ValueObject extends Object {
    parent: any
    constructor($value: unknown) {
        super($value)
    }
}

export class ValueBoolean extends Boolean {
    parent: any
    constructor($value: boolean) {
        super($value)
    }
}