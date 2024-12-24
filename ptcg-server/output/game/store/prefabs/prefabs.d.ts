import { Player, State, StoreLike } from '../..';
import { CardType, Stage } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { Effect } from '../effects/effect';
import { AttackEffect, KnockOutEffect, PowerEffect } from '../effects/game-effects';
/**
 *
 * A basic effect for checking the use of attacks.
 * @returns whether or not a specific attack was used.
 */
export declare function WAS_ATTACK_USED(effect: Effect, index: number, user: PokemonCard): effect is AttackEffect;
/**
 *
 * A basic effect for checking the use of abilites.
 * @returns whether or not a specific ability was used.
 */
export declare function WAS_ABILITY_USED(effect: Effect, index: number, user: PokemonCard): effect is PowerEffect;
export declare function abilityUsed(player: Player, card: PokemonCard): void;
export declare function shufflePlayerDeck(state: State, store: StoreLike, player: Player): State;
export declare function shuffleDeck(state: State, store: StoreLike, player: Player): State;
/**
 *
 * A basic effect for checking whether or not a passive ability gets activated.
 * @returns whether or not a passive ability was activated.
 */
export declare function PASSIVE_ABILITY_ACTIVATED(effect: Effect, user: PokemonCard): boolean;
/**
 *
 * @param state is the game state.
 * @returns the game state after discarding a stadium card in play.
 */
export declare function DISCARD_A_STADIUM_CARD_IN_PLAY(state: State): void;
export declare function SEARCH_YOUR_DECK_FOR_X_POKEMON_AND_PUT_THEM_ONTO_YOUR_BENCH(store: StoreLike, state: State, effect: AttackEffect, min: number, max: number, stage: Stage): State;
export declare function DISCARD_X_ENERGY_FROM_THIS_POKEMON(state: State, effect: AttackEffect, store: StoreLike, type: CardType, amount: number): State;
export declare function FLIP_IF_HEADS(): void;
export declare function THIS_ATTACK_DOES_X_MORE_DAMAGE(effect: AttackEffect, store: StoreLike, state: State, damage: number): State;
export declare function HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect: AttackEffect, store: StoreLike, state: State, damage: number): State;
export declare function THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect: AttackEffect, user: PokemonCard): boolean;
export declare function YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK(effect: Effect, state: State): effect is KnockOutEffect;
export declare function TAKE_X_MORE_PRIZE_CARDS(effect: KnockOutEffect, state: State): State;
export declare function THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON(damage: number, effect: AttackEffect, store: StoreLike, state: State, min: number, max: number): State;
export declare function ATTACH_X_NUMBER_OF_BASIC_ENERGY_CARDS_FROM_YOUR_DISCARD_TO_YOUR_BENCHED_POKEMON(effect: AttackEffect, store: StoreLike, state: State, amount: number): void;
export declare function SHUFFLE_DECK(effect: Effect, store: StoreLike, state: State, player: Player): State;
export declare function DISCARD_X_ENERGY_FROM_YOUR_HAND(effect: PowerEffect, store: StoreLike, state: State, minAmount: number, maxAmount: number): void;
