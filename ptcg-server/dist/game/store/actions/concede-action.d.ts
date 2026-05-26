import { Action } from './action';
export declare class ConcedeAction implements Action {
    playerId: number;
    readonly type: string;
    constructor(playerId: number);
}
