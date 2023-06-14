import { FindOperator } from "./FindOperator";
/**
 * Used for find operations.
 */
export declare type FindConditions<T> = {
    [P in keyof T]?: FindConditions<T[P]> | FindOperator<FindConditions<T[P]>>;
};
