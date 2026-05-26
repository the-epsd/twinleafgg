import { Attack, Power } from '../card/pokemon-types';
import { Effect } from './effect';
import { Player } from '../state/player';
import { PokemonCard } from '../card/pokemon-card';
import { PokemonCardList } from '../state/pokemon-card-list';
import { Card } from '../card/card';
import { CardTarget } from '../actions/play-card-action';
import { TrainerCard } from '../card/trainer-card';
import { CardList } from '../state/card-list';
import { EnergyCard } from '../card/energy-card';
export declare enum GameEffects {
    RETREAT_EFFECT = "RETREAT_EFFECT",
    RETREAT_START_EFFECT = "RETREAT_START_EFFECT",
    USE_ATTACK_EFFECT = "USE_ATTACK_EFFECT",
    USE_STADIUM_EFFECT = "USE_STADIUM_EFFECT",
    USE_POWER_EFFECT = "USE_POWER_EFFECT",
    POWER_EFFECT = "POWER_EFFECT",
    ATTACK_EFFECT = "ATTACK_EFFECT",
    KNOCK_OUT_EFFECT = "KNOCK_OUT_EFFECT",
    HEAL_EFFECT = "HEAL_EFFECT",
    EVOLVE_EFFECT = "EVOLVE_EFFECT",
    DRAW_PRIZES_EFFECT = "DRAW_PRIZES_EFFECT",
    MOVE_CARDS_EFFECT = "MOVE_CARDS_EFFECT",
    EFFECT_OF_ABILITY_EFFECT = "EFFECT_OF_ABILITY_EFFECT",
    SPECIAL_ENERGY_EFFECT = "SPECIAL_ENERGY_EFFECT",
    PUT_COUNTERS_EFFECT = "PUT_COUNTERS_EFFECT",
    PLACE_DAMAGE_COUNTERS_EFFECT = "PLACE_DAMAGE_COUNTERS_EFFECT",
    MOVE_DAMAGE_COUNTERS_EFFECT = "MOVE_DAMAGE_COUNTERS_EFFECT",
    MOVED_TO_ACTIVE_EFFECT = "MOVED_TO_ACTIVE_EFFECT"
}
export declare class MovedToActiveEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    pokemonCard: PokemonCard;
    constructor(player: Player, pokemonCard: PokemonCard);
}
export declare class RetreatEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    benchIndex: number;
    ignoreStatusConditions: boolean;
    moveRetreatCostTo: CardList;
    constructor(player: Player, benchIndex: number);
}
export declare class RetreatStartEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    constructor(player: Player);
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
export declare class UseEnergyPowerEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    power: Power;
    card: EnergyCard;
    target: CardTarget;
    constructor(player: Player, power: Power, card: EnergyCard, target: CardTarget);
}
export declare class PowerEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    power: Power;
    card: PokemonCard;
    target?: PokemonCardList;
    static DISCARD_CARD_EFFECT: string;
    static PUT_COUNTERS_EFFECT: string;
    constructor(player: Player, power: Power, card: PokemonCard, target?: PokemonCardList);
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
    source: PokemonCardList;
    constructor(player: Player, attack: Attack);
}
export declare class UseStadiumEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    stadium: Card;
    constructor(player: Player, stadium: Card);
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
    invisibleTentacles?: boolean;
    target: any;
    constructor(player: Player, opponent: Player, attack: Attack);
}
export declare class KnockOutEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    target: PokemonCardList;
    prizeCount: number;
    prizeDestination?: CardList;
    isLostCity: boolean;
    prizeIncreased: boolean;
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
    darkestImpulseSV?: boolean;
    constructor(player: Player, target: PokemonCardList, pokemonCard: PokemonCard);
}
export declare class DrawPrizesEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    prizes: CardList[];
    destination: CardList;
    constructor(player: Player, prizes: CardList[], destination: CardList);
}
export declare class MoveCardsEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    source: CardList | PokemonCardList;
    destination: CardList | PokemonCardList;
    cards?: Card[];
    count?: number;
    toTop?: boolean;
    toBottom?: boolean;
    skipCleanup?: boolean;
    sourceCard?: Card;
    sourceEffect?: any;
    constructor(source: CardList | PokemonCardList, destination: CardList | PokemonCardList, options?: {
        cards?: Card[];
        count?: number;
        toTop?: boolean;
        toBottom?: boolean;
        skipCleanup?: boolean;
        sourceCard?: Card;
        sourceEffect?: any;
    });
}
export declare class EffectOfAbilityEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    power: Power;
    card: PokemonCard;
    target?: PokemonCardList;
    constructor(player: Player, power: Power, card: PokemonCard, target?: PokemonCardList);
}
export declare class SpecialEnergyEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    card: EnergyCard;
    attachedTo: PokemonCardList;
    exemptFromOpponentsSpecialEnergyBlockingAbility: boolean;
    constructor(player: Player, card: EnergyCard, attachedTo: PokemonCardList, exemptFromOpponentsSpecialEnergyBlockingAbility?: boolean);
}
export declare class PutDamageCountersEffect extends PowerEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    damage: number;
    source: PokemonCard;
    effectOfAbility: EffectOfAbilityEffect;
    constructor(base: PowerEffect, damage: number);
}
export declare class PlaceDamageCountersEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    target: PokemonCardList;
    damage: number;
    source?: PokemonCard;
    constructor(player: Player, target: PokemonCardList, damage: number, source?: PokemonCard);
}
export declare class MoveDamageCountersEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    constructor(player: Player);
}
export { Effect };
