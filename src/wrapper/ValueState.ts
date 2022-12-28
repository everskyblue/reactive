
export class ValueString extends String {
    parent: any = null
    constructor($value: string) {
        super($value)
    }

    [Symbol.toPrimitive]() {
        
        return this;
    }

    toValue(): () => string {
    
        return () => {
            console.log(this);
            return this as any;
        } 
    }
}

export class ValueNumber extends Number {
    parent: any
    constructor($value: number) {
        super($value)
    }
    [Symbol.toPrimitive]() {
        return this;
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
    [Symbol.toPrimitive]() {
        return this;
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
    [Symbol.toPrimitive]() {
        return this;
    }
}

export class ValueBoolean extends Boolean {
    parent: any
    constructor($value: boolean) {
        super($value)
    }
    [Symbol.toPrimitive]() {
        return this;
    }
}