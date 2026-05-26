import { GameLog } from '../../game-message';
export declare type StateLogParam = {
    [key: string]: string | number;
};
export declare class StateLog {
    id: number;
    client: number;
    params: StateLogParam;
    message: GameLog;
    constructor(message: GameLog, params?: StateLogParam, client?: number);
}
