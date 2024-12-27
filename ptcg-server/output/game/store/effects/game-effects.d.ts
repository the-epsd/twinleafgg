import { Attack, Power } from '../card/pokemon-types';
import { Effect } from './effect';
import { Player } from '../state/player';
import { PokemonCard } from '../card/pokemon-card';
import { PokemonCardList } from '../state/pokemon-card-list';
import { Card } from '../card/card';
import { CardTarget } from '../actions/play-card-action';
import { TrainerCard } from '../card/trainer-card';
export declare enum GameEffects {
    RETREAT_EFFECT = "RETREAT_EFFECT",
    USE_ATTACK_EFFECT = "USE_ATTACK_EFFECT",
    USE_STADIUM_EFFECT = "USE_STADIUM_EFFECT",
    USE_POWER_EFFECT = "USE_POWER_EFFECT",
    POWER_EFFECT = "POWER_EFFECT",
    ATTACK_EFFECT = "ATTACK_EFFECT",
    KNOCK_OUT_EFFECT = "KNOCK_OUT_EFFECT",
    HEAL_EFFECT = "HEAL_EFFECT",
    EVOLVE_EFFECT = "EVOLVE_EFFECT"
}
export declare class RetreatEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    benchIndex: number;
    ignoreStatusConditions: boolean;
    constructor(player: Player, benchIndex: number);
}
export declare class UsePowerEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    power: Power;
    card: PokemonCard;
    target: CardTarget;
    constructor(player: Player, power: Power, card: PokemonCard, target: CardTarget);
}
export declare class UseTrainerPowerEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    power: Power;
    card: TrainerCard;
    target: CardTarget;
    constructor(player: Player, power: Power, card: TrainerCard, target: CardTarget);
}
export declare class PowerEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    power: Power;
    card: PokemonCard;
    static DISCARD_CARD_EFFECT: string;
    constructor(player: Player, power: Power, card: PokemonCard);
}
export declare class TrainerPowerEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    power: Power;
    card: TrainerCard;
    constructor(player: Player, power: Power, card: TrainerCard);
}
export declare class UseAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    attack: Attack;
    constructor(player: Player, attack: Attack);
}
export declare class UseStadiumEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    stadium: Card;
    constructor(player: Player, stadium: Card);
}
export declare class useToolEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    tool: Card;
    constructor(player: Player, tool: Card);
}
export declare class AttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    opponent: Player;
    attack: Attack;
    damage: number;
    ignoreWeakness: boolean;
    ignoreResistance: boolean;
    source: PokemonCardList;
    target: any;
    constructor(player: Player, opponent: Player, attack: Attack);
}
export declare class KnockOutEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    target: PokemonCardList;
    prizeCount: number;
    isLostCity: boolean;
    constructor(player: Player, target: PokemonCardList);
}
export declare class KnockOutAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    target: PokemonCardList;
    attack: Attack;
    prizeCount: number;
    constructor(player: Player, target: PokemonCardList, attack: Attack);
}
export declare class HealEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    target: PokemonCardList;
    damage: number;
    constructor(player: Player, target: PokemonCardList, damage: number);
}
export declare class EvolveEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    target: PokemonCardList;
    pokemonCard: PokemonCard;
    constructor(player: Player, target: PokemonCardList, pokemonCard: PokemonCard);
}
export { Effect };
