import { Action } from './action';
export declare class SandboxModifyPlayerAction implements Action {
    clientId: number;
    targetPlayerId: number;
    modifications: {
        prizes?: number;
        handSize?: number;
        deckSize?: number;
        discardSize?: number;
        lostzoneSize?: number;
        supporterTurn?: number;
        retreatedTurn?: number;
        energyPlayedTurn?: number;
        stadiumPlayedTurn?: number;
        stadiumUsedTurn?: number;
        usedVSTAR?: boolean;
        usedGX?: boolean;
        ancientSupporter?: boolean;
        rocketSupporter?: boolean;
    };
    readonly type: string;
    constructor(clientId: number, targetPlayerId: number, modifications: {
        prizes?: number;
        handSize?: number;
        deckSize?: number;
        discardSize?: number;
        lostzoneSize?: number;
        supporterTurn?: number;
        retreatedTurn?: number;
        energyPlayedTurn?: number;
        stadiumPlayedTurn?: number;
        stadiumUsedTurn?: number;
        usedVSTAR?: boolean;
        usedGX?: boolean;
        ancientSupporter?: boolean;
        rocketSupporter?: boolean;
    });
}
