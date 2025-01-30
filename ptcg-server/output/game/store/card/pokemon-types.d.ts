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
    name: string;
    text: string;
    effect?: (store: StoreLike, state: State, effect: AttackEffect) => void;
}
export declare enum PowerType {
    POKEBODY = 0,
    POKEPOWER = 1,
    ABILITY = 2,
    ANCIENT_TRAIT = 3,
    POKEMON_POWER = 4
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
    barrage?: boolean;
}
