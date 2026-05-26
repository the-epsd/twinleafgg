import { Action } from './action';
export declare class ReorderBenchAction implements Action {
    id: number;
    from: number;
    to: number;
    readonly type: string;
    constructor(id: number, from: number, to: number);
}
export declare class ReorderHandAction implements Action {
    id: number;
    order: number[];
    readonly type: string;
    constructor(id: number, order: number[]);
}
