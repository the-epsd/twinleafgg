export declare type ValidationFn = (value: any) => boolean;
export interface ValidationMap {
    [key: string]: Validator;
}
export declare function Validate(validationMap: ValidationMap): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare class Validator {
    valid: boolean;
    private validators;
    validate(value: any): boolean;
    required(): Validator;
    isString(): Validator;
    isBoolean(): Validator;
    isNumber(): Validator;
    minLength(len: number): Validator;
    maxLength(len: number): Validator;
    pattern(pattern: RegExp): Validator;
    isEmail(): Validator;
    isName(): Validator;
    isPassword(): Validator;
    isInt(): Validator;
}
export declare function check(): Validator;
