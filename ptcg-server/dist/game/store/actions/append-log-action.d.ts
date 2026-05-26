import { Action } from './action';
import { GameLog } from '../../game-message';
import { StateLogParam } from '../state/state-log';
export declare class AppendLogAction implements Action {
    id: number;
    message: GameLog;
    params: StateLogParam;
    readonly type: string;
    constructor(id: number, message: GameLog, params: StateLogParam);
}
