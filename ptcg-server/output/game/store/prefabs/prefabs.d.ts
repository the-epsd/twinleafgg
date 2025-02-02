import { Card, CardList, ChooseCardsOptions, Player, PokemonCardList, State, StoreLike } from '../..';
import { CardType, SpecialCondition } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { Effect } from '../effects/effect';
import { AttackEffect, EvolveEffect, KnockOutEffect, PowerEffect } from '../effects/game-effects';
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
export declare function WAS_POWER_USED(effect: Effect, index: number, user: PokemonCard): effect is PowerEffect;
/**
 *
 * Checks whether or not the Pokemon just evolved.
 * @returns whether or not `effect` is an evolve effect from this card.
 */
export declare function JUST_EVOLVED(effect: Effect, card: PokemonCard): effect is EvolveEffect;
/**
 * Adds the "ability used" board effect to the given Pokemon.
 */
export declare function ABILITY_USED(player: Player, card: PokemonCard): void;
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
/**
 * Search deck for Pokemon, show it to the opponent, put it into `player`'s hand, and shuffle `player`'s deck.
 * A `filter` can be provided for the prompt as well.
 */
export declare function SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store: StoreLike, state: State, player: Player, filter?: Partial<PokemonCard>, options?: Partial<ChooseCardsOptions>): State;
/**
 * Search deck for Pokemon, show it to the opponent, put it into `player`'s hand, and shuffle `player`'s deck.
 * A `filter` can be provided for the prompt as well.
 */
export declare function SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store: StoreLike, state: State, player: Player, filter?: Partial<PokemonCard>, options?: Partial<ChooseCardsOptions>): State;
export declare function DISCARD_X_ENERGY_FROM_THIS_POKEMON(state: State, effect: AttackEffect, store: StoreLike, type: CardType, amount: number): State;
export declare function THIS_ATTACK_DOES_X_MORE_DAMAGE(effect: AttackEffect, store: StoreLike, state: State, damage: number): State;
export declare function HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect: AttackEffect, store: StoreLike, state: State, damage: number): State;
export declare function THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect: AttackEffect, user: PokemonCard): boolean;
export declare function YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK(effect: Effect, state: State): effect is KnockOutEffect;
export declare function TAKE_X_MORE_PRIZE_CARDS(effect: KnockOutEffect, state: State): State;
export declare function PLAY_POKEMON_FROM_HAND_TO_BENCH(state: State, player: Player, card: Card): void;
export declare function THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON(damage: number, effect: AttackEffect, store: StoreLike, state: State, min: number, max: number): State;
export declare function THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store: StoreLike, state: State, effect: AttackEffect, amount: number): State;
export declare function ATTACH_X_NUMBER_OF_BASIC_ENERGY_CARDS_FROM_YOUR_DISCARD_TO_YOUR_BENCHED_POKEMON(effect: AttackEffect, store: StoreLike, state: State, amount: number): void;
export declare function DISCARD_X_ENERGY_FROM_YOUR_HAND(effect: PowerEffect, store: StoreLike, state: State, minAmount: number, maxAmount: number): State;
export declare function DISCARD_ALL_ENERGY_FROM_POKEMON(store: StoreLike, state: State, effect: AttackEffect, card: Card): void;
/**
 * A getter for the player's prize slots.
 * @returns A list of card lists containing the player's prize slots.
 */
export declare function GET_PLAYER_PRIZES(player: Player): CardList[];
/**
 * A getter for all of a player's prizes.
 * @returns A Card[] of all the player's prize cards.
 */
export declare function GET_PRIZES_AS_CARD_ARRAY(player: Player): Card[];
/**
 * Shuffles the player's deck.
 */
export declare function SHUFFLE_DECK(store: StoreLike, state: State, player: Player): State;
/**
 * Puts a list of cards into the deck, then shuffles the deck.
 */
export declare function SHUFFLE_CARDS_INTO_DECK(store: StoreLike, state: State, player: Player, cards: Card[]): void;
/**
 * Shuffle the prize cards into the deck.
 */
export declare function SHUFFLE_PRIZES_INTO_DECK(store: StoreLike, state: State, player: Player): void;
/**
 * Draws `count` cards, putting them into your hand.
 */
export declare function DRAW_CARDS(player: Player, count: number): void;
/**
 * Draws cards until you have `count` cards in hand.
 */
export declare function DRAW_CARDS_UNTIL_CARDS_IN_HAND(player: Player, count: number): void;
/**
 * Draws `count` cards from the top of your deck as face down prize cards.
 */
export declare function DRAW_CARDS_AS_FACE_DOWN_PRIZES(player: Player, count: number): void;
export declare function SEARCH_DECK_FOR_CARDS_TO_HAND(store: StoreLike, state: State, player: Player, min?: number, max?: number): void;
/**
 * Checks if abilities are blocked on `card` for `player`.
 * @returns `true` if the ability is blocked, `false` if the ability is able to go thru.
 */
export declare function IS_ABILITY_BLOCKED(store: StoreLike, state: State, player: Player, card: PokemonCard): boolean;
export declare function CAN_EVOLVE_ON_FIRST_TURN_GOING_SECOND(state: State, player: Player, pokemon: PokemonCardList): void;
/**
 * Finds `card` and moves it from its current CardList to `destination`.
 */
export declare function MOVE_CARD_TO(state: State, card: Card, destination: CardList): void;
export declare function SWITCH_ACTIVE_WITH_BENCHED(store: StoreLike, state: State, player: Player): State;
export declare function SHOW_CARDS_TO_PLAYER(store: StoreLike, state: State, player: Player, cards: Card[]): State;
export declare function CONFIRMATION_PROMPT(store: StoreLike, state: State, player: Player, callback: (result: boolean) => void): State;
export declare function COIN_FLIP_PROMPT(store: StoreLike, state: State, player: Player, callback: (result: boolean) => void): State;
export declare function SIMULATE_COIN_FLIP(store: StoreLike, state: State, player: Player): boolean;
export declare function GET_FIRST_PLAYER_BENCH_SLOT(player: Player): PokemonCardList;
export declare function GET_PLAYER_BENCH_SLOTS(player: Player): PokemonCardList[];
export declare function BLOCK_IF_NO_SLOTS(slots: PokemonCardList[]): void;
export declare function BLOCK_IF_DECK_EMPTY(player: Player): void;
export declare function ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card, specialConditions: SpecialCondition[], poisonDamage?: number, burnDamage?: number, sleepFlips?: number): void;
export declare function ADD_SLEEP_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card, sleepFlips?: number): void;
export declare function ADD_POISON_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card, poisonDamage?: number): void;
export declare function ADD_BURN_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card, burnDamage?: number): void;
export declare function ADD_PARALYZED_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card): void;
export declare function ADD_CONFUSION_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card): void;
export declare function ADD_MARKER(marker: string, owner: Player | Card | PokemonCard | PokemonCardList, source: Card): void;
export declare function REMOVE_MARKER(marker: string, owner: Player | Card | PokemonCard | PokemonCardList, source?: Card): void;
export declare function HAS_MARKER(marker: string, owner: Player | Card | PokemonCard | PokemonCardList, source?: Card): boolean;
export declare function BLOCK_EFFECT_IF_MARKER(marker: string, owner: Player | Card | PokemonCard | PokemonCardList, source?: Card): void;
export declare function PREVENT_DAMAGE_IF_TARGET_HAS_MARKER(effect: Effect, marker: string, source?: Card): void;
export declare function REMOVE_MARKER_AT_END_OF_TURN(effect: Effect, marker: string, source: Card): void;
export declare function REPLACE_MARKER_AT_END_OF_TURN(effect: Effect, oldMarker: string, newMarker: string, source: Card): void;
/**
 * If an EndTurnEffect is given, will check for `clearerMarker` on the player whose turn it is,
 * and clear all of their opponent's `oppMarker`s.
 * Useful for "During your opponent's next turn" effects.
 */
export declare function CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state: State, effect: Effect, clearerMarker: string, oppMarker: string, source: Card): void;
