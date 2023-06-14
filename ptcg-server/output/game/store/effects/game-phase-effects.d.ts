import { Effect } from './effect';
import { Player } from '../state/player';
export declare enum GamePhaseEffects {
    END_TURN_EFFECT = "END_TURN_EFFECT",
    WHO_BEGINS_EFFECT = "WHO_BEGINS_EFFECT",
    BETWEEN_TURNS_EFFECT = "BETWEEN_TURNS_EFFECT"
}
export declare class EndTurnEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    constructor(player: Player);
}
export declare class WhoBeginsEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player | undefined;
    constructor();
}
export declare class BetweenTurnsEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    poisonDamage: number;
    burnDamage: number;
    burnFlipResult: boolean | undefined;
    asleepFlipResult: boolean | undefined;
    constructor(player: Player);
}
