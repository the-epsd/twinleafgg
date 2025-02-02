import { Action } from './action';
export declare enum AbortGameReason {
    TIME_ELAPSED = 0,
    ILLEGAL_MOVES = 1,
    DISCONNECTED = 2
}
export declare class AbortGameAction implements Action {
    culpritId: number;
    reason: AbortGameReason;
    readonly type: string;
    constructor(culpritId: number, reason: AbortGameReason);
}
