import { Action } from './action';
import { GamePhase } from '../state/state';
import { Rules } from '../state/rules';
export declare class SandboxModifyGameStateAction implements Action {
    clientId: number;
    modifications: {
        turn?: number;
        phase?: GamePhase;
        activePlayer?: number;
        skipOpponentTurn?: boolean;
        isSuddenDeath?: boolean;
        rules?: Partial<Rules>;
    };
    readonly type: string;
    constructor(clientId: number, modifications: {
        turn?: number;
        phase?: GamePhase;
        activePlayer?: number;
        skipOpponentTurn?: boolean;
        isSuddenDeath?: boolean;
        rules?: Partial<Rules>;
    });
}
