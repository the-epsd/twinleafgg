import { Action } from './action';
import { CardTarget } from './play-card-action';
export declare class AttackAction implements Action {
    clientId: number;
    name: string;
    readonly type: string;
    constructor(clientId: number, name: string);
}
export declare class UseAbilityAction implements Action {
    clientId: number;
    name: string;
    target: CardTarget;
    readonly type: string;
    constructor(clientId: number, name: string, target: CardTarget);
}
export declare class UseTrainerAbilityAction implements Action {
    clientId: number;
    name: string;
    target: CardTarget;
    readonly type: string;
    constructor(clientId: number, name: string, target: CardTarget);
}
export declare class UseStadiumAction implements Action {
    clientId: number;
    readonly type: string;
    constructor(clientId: number);
}
export declare class RetreatAction implements Action {
    clientId: number;
    benchIndex: number;
    readonly type: string;
    constructor(clientId: number, benchIndex: number);
}
export declare class PassTurnAction implements Action {
    clientId: number;
    readonly type: string;
    constructor(clientId: number);
}
