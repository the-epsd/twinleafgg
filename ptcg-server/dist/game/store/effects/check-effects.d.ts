import { CardType } from '../card/card-types';
import { Effect } from './effect';
import { Player } from '../state/player';
import { PokemonCardList } from '../state/pokemon-card-list';
import { Resistance, Weakness, Attack } from '../card/pokemon-types';
import { EnergyMap } from '../prompts/choose-energy-prompt';
export declare enum CheckEffects {
    CHECK_HP_EFFECT = "CHECK_HP_EFFECT",
    CHECK_PRIZES_COUNT_EFFECT = "CHECK_PRIZE_COUNT_EFFECT",
    CHECK_POKEMON_STATS_EFFECT = "CHECK_POKEMON_STATS_EFFECT",
    CHECK_POKEMON_TYPE_EFFECT = "CHECK_POKEMON_TYPE_EFFECT",
    CHECK_RETREAT_COST_EFFECT = "CHECK_RETREAT_COST_EFFECT",
    CHECK_ATTACK_COST_EFFECT = "CHECK_ATTACK_COST_EFFECT",
    CHECK_ENOUGH_ENERGY_EFFECT = "CHECK_ENOUGH_ENERGY_EFFECT",
    CHECK_POKEMON_PLAYED_TURN_EFFECT = "CHECK_POKEMON_PLAYED_TURN_EFFECT",
    CHECK_TABLE_STATE_EFFECT = "CHECK_TABLE_STATE_EFFECT"
}
export declare class CheckHpEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    target: PokemonCardList;
    hp: number;
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
    constructor(player: Player, source?: PokemonCardList);
}
export declare class CheckTableStateEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    benchSize: number;
    constructor();
}
