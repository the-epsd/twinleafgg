import { PokemonCard } from '../card/pokemon-card';
import { State } from '../..';
import { AttackEffect } from '../effects/game-effects';
import { StoreLike, Card } from '../..';
/**
 * These prefabs are for general attack effects.
 */
export declare function DISCARD_A_STADIUM_CARD_IN_PLAY(state: State): void;
export declare function DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND(x: number, effect: AttackEffect, state: State): State | undefined;
export declare function HEAL_X_DAMAGE_FROM_THIS_POKEMON(damage: number, effect: AttackEffect, store: StoreLike, state: State): void;
export declare function PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND(x: number, filterFn: ((card: Card) => boolean) | undefined, store: StoreLike, state: State, effect: AttackEffect): State;
export declare function PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(x: number, store: StoreLike, state: State, effect: AttackEffect): State;
export declare function SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store: StoreLike, state: State, effect: AttackEffect): State;
export declare function THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE(damage: number, filterFn: ((card: PokemonCard) => boolean) | undefined, effect: AttackEffect): void;
export declare function THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(damage: number, effect: AttackEffect, store: StoreLike, state: State): State;
export declare function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store: StoreLike, state: State, effect: AttackEffect): void;
export declare function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store: StoreLike, state: State, effect: AttackEffect): void;
export declare function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store: StoreLike, state: State, effect: AttackEffect): void;
export declare function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store: StoreLike, state: State, effect: AttackEffect): void;
export declare function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store: StoreLike, state: State, effect: AttackEffect): void;
