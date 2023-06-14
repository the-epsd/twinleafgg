import { TypeORMError } from "./TypeORMError";
export declare class EntityColumnNotFound extends TypeORMError {
    constructor(propertyPath: string);
}
