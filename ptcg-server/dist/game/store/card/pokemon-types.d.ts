import { CardType } from './card-types';
import { StoreLike } from '../store-like';
import { State } from '../state/state';
import { AttackEffect, PowerEffect } from '../effects/game-effects';
export interface Weakness {
    type: CardType;
    value?: number;
}
export interface Resistance {
    type: CardType;
    value: number;
}
export interface Attack {
    cost: CardType[];
    damage: number;
    damageCalculation?: string;
    copycatAttack?: boolean;
    gxAttack?: boolean;
    shredAttack?: boolean;
    useOnBench?: boolean;
    canUseOnFirstTurn?: boolean;
    name: string;
    text: string;
    barrage?: boolean;
    effect?: (store: StoreLike, state: State, effect: AttackEffect) => void;
}
export declare enum PowerType {
    POKEBODY = 0,
    POKEPOWER = 1,
    ABILITY = 2,
    ANCIENT_TRAIT = 3,
    BABY_RULE = 4,
    HELD_ITEM = 5,
    POKEMON_POWER = 6,
    VUNION_ASSEMBLY = 7,
    LEGEND_ASSEMBLY = 8,
    TRAINER_ABILITY = 9,
    HOLONS_SPECIAL_ENERGY_EFFECT = 10,
    MEGA_EVOLUTION_RULE = 11,
    LV_X_RULE = 12,
    BREAK_RULE = 13,
    ARCEUS_RULE = 14,
    ENERGY_ABILITY = 15
}
export interface Power {
    name: string;
    powerType: PowerType;
    text: string;
    effect?: (store: StoreLike, state: State, effect: PowerEffect) => State;
    useWhenInPlay?: boolean;
    useFromHand?: boolean;
    useFromDiscard?: boolean;
    exemptFromAbilityLock?: boolean;
    exemptFromInitialize?: boolean;
    abilityLock?: boolean;
    barrage?: boolean;
    knocksOutSelf?: boolean;
    isFossil?: boolean;
}
