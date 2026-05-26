import { Effect } from './effect';
import { Player } from '../state/player';
import { Card } from '../card/card';
import { Attack } from '../card/pokemon-types';
export declare enum GamePhaseEffects {
    BEGIN_TURN_EFFECT = "BEGIN_TURN_EFFECT",
    DRAW_CARD_FOR_TURN_EFFECT = "DRAW_CARD_FOR_TURN_EFFECT",
    END_TURN_EFFECT = "END_TURN_EFFECT",
    WHO_BEGINS_EFFECT = "WHO_BEGINS_EFFECT",
    BETWEEN_TURNS_EFFECT = "BETWEEN_TURNS_EFFECT",
    CHOOSE_STARTING_POKEMON_EFFECT = "CHOOSE_STARTING_POKEMON_EFFECT",
    DREW_TOPDECK_EFFECT = "DREW_TOPDECK_EFFECT",
    CHOOSE_PRIZE_EFFECT = "CHOOSE_PRIZE_EFFECT",
    AFTER_ATTACK_EFFECT = "AFTER_ATTACK_EFFECT"
}
export declare class BeginTurnEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    constructor(player: Player);
}
export declare class DrawCardForTurnEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    constructor(player: Player);
}
export declare class DrewTopdeckEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    handCard: Card;
    constructor(player: Player, handCard: Card);
}
export declare class ChooseStartingPokemonEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    constructor(player: Player);
}
export declare class AfterAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    opponent: Player;
    attack: Attack;
    constructor(player: Player, opponent: Player, attack: Attack);
}
export declare class ChoosePrizeEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    constructor(player: Player);
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
    flipsForSleep: number | undefined;
    burnDamage: number;
    burnFlipResult: boolean | undefined;
    asleepFlipResult: boolean | undefined;
    maternalComfortUsed?: boolean;
    constructor(player: Player);
}
