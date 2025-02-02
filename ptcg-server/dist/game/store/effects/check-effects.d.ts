import { CardType, SpecialCondition } from '../card/card-types';
import { Effect } from './effect';
import { Player } from '../state/player';
import { PokemonCardList } from '../state/pokemon-card-list';
import { Resistance, Weakness, Attack, Power } from '../card/pokemon-types';
import { EnergyMap } from '../prompts/choose-energy-prompt';
import { PokemonCard } from '../card/pokemon-card';
export declare enum CheckEffects {
    CHECK_HP_EFFECT = "CHECK_HP_EFFECT",
    CHECK_PRIZES_COUNT_EFFECT = "CHECK_PRIZE_COUNT_EFFECT",
    CHECK_POKEMON_STATS_EFFECT = "CHECK_POKEMON_STATS_EFFECT",
    CHECK_POKEMON_POWERS_EFFECT = "CHECK_POKEMON_POWERS_EFFECT",
    CHECK_POKEMON_ATTACKS_EFFECT = "CHECK_POKEMON_ATTACKS_EFFECT",
    CHECK_POKEMON_TYPE_EFFECT = "CHECK_POKEMON_TYPE_EFFECT",
    CHECK_RETREAT_COST_EFFECT = "CHECK_RETREAT_COST_EFFECT",
    CHECK_ATTACK_COST_EFFECT = "CHECK_ATTACK_COST_EFFECT",
    CHECK_ENOUGH_ENERGY_EFFECT = "CHECK_ENOUGH_ENERGY_EFFECT",
    CHECK_POKEMON_PLAYED_TURN_EFFECT = "CHECK_POKEMON_PLAYED_TURN_EFFECT",
    CHECK_TABLE_STATE_EFFECT = "CHECK_TABLE_STATE_EFFECT",
    ADD_SPECIAL_CONDITIONS_EFFECT = "ADD_SPECIAL_CONDITIONS_EFFECT"
}
export declare class CheckPokemonPowersEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    target: PokemonCardList;
    powers: Power[];
    constructor(player: Player, target: PokemonCardList);
}
export declare class CheckPokemonAttacksEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    attacks: Attack[];
    constructor(player: Player);
}
export declare class CheckHpEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    target: PokemonCardList;
    hp: number;
    hpBoosted?: boolean;
    constructor(player: Player, target: PokemonCardList);
}
export declare class CheckPokemonPlayedTurnEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    target: PokemonCardList;
    pokemonPlayedTurn: number;
    constructor(player: Player, target: PokemonCardList);
}
export declare class CheckPokemonStatsEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    target: PokemonCardList;
    weakness: Weakness[];
    resistance: Resistance[];
    constructor(target: PokemonCardList);
}
export declare class CheckPokemonTypeEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    target: PokemonCardList;
    cardTypes: CardType[];
    constructor(target: PokemonCardList);
}
export declare class CheckRetreatCostEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    cost: CardType[];
    constructor(player: Player);
}
export declare class CheckAttackCostEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    attack: Attack;
    cost: CardType[];
    constructor(player: Player, attack: Attack);
}
export declare class CheckProvidedEnergyEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    source: PokemonCardList;
    energyMap: EnergyMap[];
    totalProvidedTypes: EnergyMap[];
    constructor(player: Player, source?: PokemonCardList);
}
export declare class CheckTableStateEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    benchSizes: number[];
    constructor(benchSizes: number[]);
}
export declare class AddSpecialConditionsPowerEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    poisonDamage?: number;
    specialConditions: SpecialCondition[];
    player: Player;
    power: Power;
    card: PokemonCard;
    target: PokemonCardList;
    constructor(player: Player, power: Power, card: PokemonCard, target: PokemonCardList, specialConditions: SpecialCondition[]);
}
