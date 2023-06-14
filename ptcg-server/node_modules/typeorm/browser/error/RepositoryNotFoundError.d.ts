import { EntityTarget } from "../common/EntityTarget";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when repository for the given class is not found.
 */
export declare class RepositoryNotFoundError extends TypeORMError {
    constructor(connectionName: string, entityClass: EntityTarget<any>);
}
