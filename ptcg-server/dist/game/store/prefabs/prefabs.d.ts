import { AttachEnergyOptions, Card, CardList, CardTarget, ChooseCardsOptions, EnergyCard, GameMessage, Player, PlayerType, PokemonCardList, SlotType, State, StoreLike, TrainerCard } from '../..';
import { TrainerEffect } from '../effects/play-card-effects';
import { CardTag, CardType, SpecialCondition } from '../card/card-types';
import { Attack } from '../card/pokemon-types';
import { PokemonCard } from '../card/pokemon-card';
import { AfterDamageEffect, DealDamageEffect, PutDamageEffect } from '../effects/attack-effects';
import { Effect } from '../effects/effect';
import { AttackEffect, EvolveEffect, KnockOutEffect, PowerEffect } from '../effects/game-effects';
import { AfterAttackEffect } from '../effects/game-phase-effects';
/**
 *
 * A basic effect for checking the use of attacks.
 * @returns whether or not a specific attack was used.
 */
export declare function WAS_ATTACK_USED(effect: Effect, index: number, user: PokemonCard): effect is AttackEffect;
export declare function DEAL_DAMAGE(effect: Effect): effect is DealDamageEffect;
export declare function PUT_DAMAGE(effect: Effect): effect is PutDamageEffect;
/**
 *
 * A basic effect for checking the use of abilites.
 * @returns whether or not a specific ability was used.
 */
export declare function WAS_POWER_USED(effect: Effect, index: number, user: PokemonCard): effect is PowerEffect;
export declare const AFTER_ATTACK: (effect: Effect, index: number, user: PokemonCard) => effect is AfterAttackEffect;
/**
 *
 * Checks whether or not the Pokemon just evolved.
 * @returns whether or not `effect` is an evolve effect from this card.
 */
export declare function JUST_EVOLVED(effect: Effect, card: PokemonCard): effect is EvolveEffect;
/**
 * Returns whether the given Pokemon moved from the player's Bench to the Active Spot this turn.
 * Uses engine-tracked player.movedToActiveThisTurn (cleared at turn start).
 */
export declare function MOVED_TO_ACTIVE_THIS_TURN(player: Player, pokemon: PokemonCard): boolean;
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
export declare function THIS_ATTACK_DOES_X_MORE_DAMAGE(effect: AttackEffect, store: StoreLike, state: State, damage: number): State;
export interface NextTurnAttackBonusOptions {
    attack: Attack;
    source: Card;
    bonusDamage: number;
    bonusMarker: string;
    clearMarker: string;
}
/**
 * Standard marker lifecycle for:
 * "During your next turn, this Pokemon's [Attack Name] attack does [N] more damage."
 *
 * Applies bonus when the same attack is used while marker is active and clears after that next turn.
 */
export declare function NEXT_TURN_ATTACK_BONUS(effect: Effect, options: NextTurnAttackBonusOptions): void;
export interface NextTurnAttackBaseDamageOptions {
    setupAttack: Attack;
    boostedAttack: Attack;
    source: Card;
    baseDamage: number;
    bonusMarker: string;
    clearMarker: string;
}
/**
 * Standard marker lifecycle for:
 * "During your next turn, this Pokemon's [Attack Name] attack's base damage is [N]."
 *
 * `setupAttack` is the attack that applies the marker and `boostedAttack` is the attack
 * whose base damage is overridden during the next turn.
 */
export declare function NEXT_TURN_ATTACK_BASE_DAMAGE(effect: Effect, options: NextTurnAttackBaseDamageOptions): void;
export interface CopyBenchAttackOptions {
    allowCancel?: boolean;
    throwIfNoBenchedPokemon?: boolean;
    disallowCopycatAttack?: boolean;
}
/**
 * Generic implementation for:
 * "Choose 1 of your Benched Pokemon's attacks and use it as this attack."
 *
 * Call this inside your WAS_ATTACK_USED(...) block (optionally coin-gated).
 */
export declare function COPY_BENCH_ATTACK(store: StoreLike, state: State, effect: AttackEffect, options?: CopyBenchAttackOptions): State;
export declare function COPY_OPPONENT_ACTIVE_ATTACK(store: StoreLike, state: State, effect: AttackEffect): State;
export declare function COPY_OPPONENTS_LAST_ATTACK(store: StoreLike, state: State, effect: AttackEffect): State;
export interface ToolActiveDamageBonusOptions {
    damageBonus: number;
    sourcePokemonName?: string;
    sourceCardType?: CardType;
    sourceCardTag?: CardTag;
}
/**
 * Standard Tool damage hook for text like:
 * "If this card is attached to [condition], each of its attacks does [N] more damage
 * to the Active Pokemon (before applying Weakness and Resistance)."
 */
export declare function TOOL_ACTIVE_DAMAGE_BONUS(store: StoreLike, state: State, effect: Effect, tool: TrainerCard, options: ToolActiveDamageBonusOptions): void;
export interface ToolSetHpIfOptions {
    hp: number;
    sourcePokemonName?: string;
    sourceCardType?: CardType;
    sourceCardTag?: CardTag;
}
/**
 * Standard Tool HP hook for text like:
 * "If this card is attached to [condition], its maximum HP is [N]."
 */
export declare function TOOL_SET_HP_IF(store: StoreLike, state: State, effect: Effect, tool: TrainerCard, options: ToolSetHpIfOptions): void;
export declare function GET_TOTAL_ENERGY_ATTACHED_TO_PLAYERS_POKEMON(player: Player, store: StoreLike, state: State): number;
export declare function DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG(effect: AttackEffect, state: State, damage: number, ...cardTags: CardTag[]): void;
export declare function DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN(effect: AttackEffect, state: State, damage: number): void;
export declare function HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect: AttackEffect, store: StoreLike, state: State, damage: number): State;
export declare function THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect: AttackEffect, user: PokemonCard): boolean;
export declare function YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK(effect: Effect, state: State): effect is KnockOutEffect;
export interface TakeSpecificPrizesOptions {
    destination?: CardList;
    skipReduce?: boolean;
}
export interface TakeXPrizesOptions extends TakeSpecificPrizesOptions {
    promptOptions?: {
        allowCancel?: boolean;
        blocked?: number[];
    };
}
export declare function TAKE_SPECIFIC_PRIZES(store: StoreLike, state: State, player: Player, prizes: CardList[], options?: TakeSpecificPrizesOptions): void;
export declare function TAKE_X_PRIZES(store: StoreLike, state: State, player: Player, count: number, options?: TakeXPrizesOptions, callback?: (chosenPrizes: CardList[]) => void): State;
export declare function TAKE_X_MORE_PRIZE_CARDS(effect: KnockOutEffect, state: State): State;
export declare function PLAY_POKEMON_FROM_HAND_TO_BENCH(state: State, player: Player, card: Card): void;
export declare function DEVOLVE_POKEMON(store: StoreLike, state: State, target: PokemonCardList, destination: CardList): State | undefined;
export declare type DevolutionDestination = 'hand' | 'deck' | 'discard' | 'lostzone';
/**
 * Compound helper for text like:
 * "Devolve the Defending Pokemon and put the highest Stage Evolution card on it into your opponent's hand/deck/discard/Lost Zone."
 */
export declare function DEVOLVE_DEFENDING_AFTER_ATTACK(store: StoreLike, state: State, effect: Effect, index: number, user: PokemonCard, destination?: DevolutionDestination): State;
export declare function THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(damage: number, effect: AttackEffect, store: StoreLike, state: State, min: number, max: number, applyWeaknessAndResistance?: boolean, slots?: SlotType[]): State;
export declare function THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON(damage: number, effect: AttackEffect, store: StoreLike, state: State, benchOnly?: boolean): void;
export declare function THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store: StoreLike, state: State, effect: AttackEffect, amount: number): State;
export declare function DAMAGE_OPPONENT_POKEMON(store: StoreLike, state: State, effect: AttackEffect, damage: number, targets: PokemonCardList[]): void;
export declare function ATTACH_ENERGY_PROMPT(store: StoreLike, state: State, player: Player, playerType: PlayerType, sourceSlot: SlotType, destinationSlots: SlotType[], filter?: Partial<EnergyCard>, options?: Partial<AttachEnergyOptions>): State;
export declare function DISCARD_X_ENERGY_FROM_YOUR_HAND(effect: PowerEffect, store: StoreLike, state: State, minAmount: number, maxAmount: number): State;
/**
 * Discard a specific set of Energies of the player's choice from this Pokémon (e.g. 3 [R] energy). Not restricted to Basics.
 * @param energyMap The Energies that must be discarded.
 */
export declare function DISCARD_SPECIFIC_ENERGY_FROM_THIS_POKEMON(store: StoreLike, state: State, effect: AttackEffect, energyMap: CardType[]): void;
export declare function PUT_SPECIFIC_ENERGY_FROM_THIS_POKEMON_INTO_HAND(store: StoreLike, state: State, effect: AttackEffect, energyMap: CardType[]): void;
export declare function DISCARD_ALL_ENERGY_FROM_POKEMON(store: StoreLike, state: State, effect: AttackEffect, card: Card): void;
export interface AsOftenAsYouLikeAttachBasicTypeEnergyFromHandOptions {
    destinationSlots?: SlotType[];
    targetFilter?: (target: PokemonCardList, pokemonCard: PokemonCard) => boolean;
    promptOptions?: Partial<AttachEnergyOptions>;
}
/**
 * Compound helper for text like:
 * "As often as you like during your turn, attach a basic [type] Energy card from your hand to 1 of your Pokémon."
 *
 * This helper does not include "once per turn" tracking. Pair it with
 * `USE_ABILITY_ONCE_PER_TURN` when card text requires that limit.
 */
export declare function AS_OFTEN_AS_YOU_LIKE_ATTACH_BASIC_TYPE_ENERGY_FROM_HAND(store: StoreLike, state: State, player: Player, cardType: CardType, options?: AsOftenAsYouLikeAttachBasicTypeEnergyFromHandOptions): State;
export interface AttachXTypeEnergyFromDiscardToOnePokemonOptions {
    destinationSlots?: SlotType[];
    targetFilter?: (target: PokemonCardList, pokemonCard: PokemonCard) => boolean;
    energyFilter?: Partial<EnergyCard>;
    min?: number;
    allowCancel?: boolean;
    onAttached?: (transfers: {
        to: CardTarget;
        card: Card;
    }[]) => void;
}
/**
 * Compound helper for text like:
 * "Attach up to X [type] Energy cards from your discard pile to 1 of your Pokémon."
 *
 * `cardType` is optional. When omitted, any Energy is legal.
 */
export declare function ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(store: StoreLike, state: State, player: Player, amount: number, cardType?: CardType, options?: AttachXTypeEnergyFromDiscardToOnePokemonOptions): State;
export interface AttachUpToXEnergyFromDeckToYOfYourPokemonOptions {
    destinationSlots?: SlotType[];
    targetFilter?: (target: PokemonCardList, pokemonCard: PokemonCard) => boolean;
    energyFilter?: Partial<EnergyCard>;
    min?: number;
    allowCancel?: boolean;
    differentTypes?: boolean;
    differentTargets?: boolean;
    sameTarget?: boolean;
    validCardTypes?: CardType[];
    maxPerType?: number;
    onAttached?: (transfers: {
        to: CardTarget;
        card: Card;
    }[]) => void;
}
/**
 * Compound helper for text like:
 * "Attach up to X Energy cards from your deck to Y of your Pokémon."
 *
 * - `maxEnergyCards` controls how many Energy cards may be attached.
 * - `maxPokemonTargets` controls how many different Pokémon may receive those attachments.
 * - For Mirage Gate-style behavior, pass:
 *   `differentTypes: true`, `energyFilter: { energyType: EnergyType.BASIC }`.
 */
export declare function ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON(store: StoreLike, state: State, player: Player, maxEnergyCards: number, maxPokemonTargets: number, options?: AttachUpToXEnergyFromDeckToYOfYourPokemonOptions): State;
/**
 * Discards the top `amount` cards of your own deck (self-mill).
 */
export declare function DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store: StoreLike, state: State, player: Player, amount: number, card: Card, sourceEffect: any): State;
export declare type CountCardsZone = 'discard' | 'lostzone';
/**
 * Counts cards in one of your zones using a partial field filter and/or predicate.
 * Useful for effects like Night March / United Wings that need custom matching logic.
 */
export declare function COUNT_MATCHING_CARDS_IN_ZONE(player: Player, zone: CountCardsZone, filter?: Partial<Card>, predicate?: (card: Card) => boolean): number;
/**
 * Checks whether a Pokémon has any Energy card attached.
 */
export declare function THIS_POKEMON_HAS_ANY_ENERGY_ATTACHED(target: PokemonCardList): boolean;
/**
 * Convenience guard for cards that can only be used if your VSTAR Power is still available.
 */
export declare function BLOCK_IF_VSTAR_POWER_USED(player: Player): void;
/**
 * Returns true if the given player has already used their VSTAR Power this game.
 */
export declare function PLAYER_HAS_USED_VSTAR_POWER(player: Player): boolean;
/**
 * Returns true if your opponent has already used their VSTAR Power this game.
 */
export declare function OPPONENT_HAS_USED_VSTAR_POWER(state: State, player: Player): boolean;
/**
 * Discards the top `amount` cards of the opponent's deck (commonly called "milling").
 * @param player The player ***using*** this effect. Their opponent will be milled.
 * @param amount The number of cards to discard.
 * @param card The card causing the effect.
 * @param sourceEffect The attack or ability causing the effect.
 */
export declare function DISCARD_TOP_X_OF_OPPONENTS_DECK(store: StoreLike, state: State, player: Player, amount: number, card: Card, sourceEffect: any): void;
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
 * Draws up to `count` cards, letting the player choose to draw fewer than the maximum.
 *
 * TODO: this should also allow the player to draw them 1 by 1 if they want
 */
export declare function DRAW_UP_TO_X_CARDS(store: StoreLike, state: State, player: Player, count: number): void;
/**
 * Draws cards until you have `count` cards in hand.
 */
export declare function DRAW_CARDS_UNTIL_CARDS_IN_HAND(player: Player, count: number): void;
/**
 * Draws `count` cards from the top of your deck as face down prize cards.
 */
export declare function DRAW_CARDS_AS_FACE_DOWN_PRIZES(player: Player, count: number): void;
export declare function SEARCH_DECK_FOR_CARDS_TO_HAND(store: StoreLike, state: State, player: Player, sourceCard: Card, filter?: Partial<Card>, options?: Partial<ChooseCardsOptions>, sourceEffect?: any): void;
export declare function CLEAN_UP_SUPPORTER(store: StoreLike, effect: TrainerEffect, player: Player): void;
/**
 * Search discard pile for card, show it to the opponent, put it into `player`'s hand.
 * A `filter` can be provided for the prompt as well.
 */
export declare function SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store: StoreLike, state: State, player: Player, sourceCard: Card, filter?: Partial<Card>, options?: Partial<ChooseCardsOptions>, sourceEffect?: any): void;
export declare function GET_CARDS_ON_BOTTOM_OF_DECK(player: Player, amount?: number): Card[];
/**
 * Checks if abilities are blocked on `card` for `player`.
 * @returns `true` if the ability is blocked, `false` if the ability is able to go thru.
 */
export declare function IS_ABILITY_BLOCKED(store: StoreLike, state: State, player: Player, card: PokemonCard): boolean;
/**
 * Checks if pokebodies are blocked on `card` for `player`.
 * @returns `true` if the pokebody is blocked, `false` if the pokebody is able to go thru.
 */
export declare function IS_POKEBODY_BLOCKED(store: StoreLike, state: State, player: Player, card: PokemonCard): boolean;
/**
 * Checks if pokepowers are blocked on `card` for `player`.
 * @returns `true` if the pokepower is blocked, `false` if the pokepower is able to go thru.
 */
export declare function IS_POKEPOWER_BLOCKED(store: StoreLike, state: State, player: Player, card: PokemonCard): boolean;
/**
 * Checks if pokemon powers are blocked on `card` for `player`.
 * @returns `true` if the pokemon power is blocked, `false` if the pokepower is able to go thru.
 */
export declare function IS_POKEMON_POWER_BLOCKED(store: StoreLike, state: State, player: Player, card: PokemonCard): boolean;
/**
 * Checks if a tool's effect is being blocked
 * @returns `true` if the tool's effect is blocked, `false` if the tool's effect is able to activate.
 */
export declare function IS_TOOL_BLOCKED(store: StoreLike, state: State, player: Player, card: TrainerCard): boolean;
/**
 * Checks if a special energy's effect is being blocked for the given player and Pokemon it is attached to. Do not use in CheckProvidedEnergyEffect.
 * @returns `true` if the special energy's effect is blocked, `false` if the special energy's effect is able to activate.
 */
export declare function IS_SPECIAL_ENERGY_BLOCKED(store: StoreLike, state: State, player: Player, card: EnergyCard, attachedTo: PokemonCardList, exemptFromOpponentsSpecialEnergyBlockingAbility?: boolean): boolean;
export declare function CAN_EVOLVE_ON_FIRST_TURN_GOING_SECOND(state: State, player: Player, pokemon: PokemonCardList): void;
/**
 * Finds `card` and moves it from its current CardList to `destination`.
 */
export declare function MOVE_CARD_TO(state: State, card: Card, destination: CardList): void;
export declare function SWITCH_ACTIVE_WITH_BENCHED(store: StoreLike, state: State, player: Player): State | undefined;
export interface SwitchInOpponentBenchedPokemonOptions {
    allowCancel?: boolean;
    blocked?: CardTarget[];
    onSwitched?: (target: PokemonCardList) => void;
}
/**
 * Compound helper for "switch in" effects:
 * "Switch 1 of your opponent's Benched Pokémon with their Active Pokémon."
 */
export declare function SWITCH_IN_OPPONENT_BENCHED_POKEMON(store: StoreLike, state: State, player: Player, options?: SwitchInOpponentBenchedPokemonOptions): State;
export interface SwitchOutOpponentActivePokemonOptions {
    allowCancel?: boolean;
    blocked?: CardTarget[];
    onSwitched?: (target: PokemonCardList) => void;
}
/**
 * Compound helper for text like:
 * "Switch out your opponent's Active Pokémon to the Bench.
 * (Your opponent chooses the new Active Pokémon.)"
 *
 * Common on effects like Repel and the opponent-facing part of Escape Rope.
 */
export declare function SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store: StoreLike, state: State, player: Player, options?: SwitchOutOpponentActivePokemonOptions): State;
/**
 * Backward-compatible alias for `SWITCH_OUT_OPPONENT_ACTIVE_POKEMON`.
 */
export declare function OPPONENT_SWITCHES_THEIR_ACTIVE_POKEMON(store: StoreLike, state: State, player: Player, options?: SwitchOutOpponentActivePokemonOptions): State;
/**
 * Backward-compatible alias for `SwitchInOpponentBenchedPokemonOptions`.
 */
export declare type GustOpponentBenchedPokemonOptions = SwitchInOpponentBenchedPokemonOptions;
/**
 * Backward-compatible alias for `SWITCH_IN_OPPONENT_BENCHED_POKEMON`.
 */
export declare function GUST_OPPONENT_BENCHED_POKEMON(store: StoreLike, state: State, player: Player, options?: SwitchInOpponentBenchedPokemonOptions): State;
/**
 * Backward-compatible alias for `SwitchOutOpponentActivePokemonOptions`.
 */
export declare type OpponentSwitchesTheirActivePokemonOptions = SwitchOutOpponentActivePokemonOptions;
export interface MoveDamageCountersOptions {
    playerType?: PlayerType;
    slots?: SlotType[];
    min?: number;
    max?: number;
    allowCancel?: boolean;
    blockedFrom?: CardTarget[];
    blockedTo?: CardTarget[];
    singleSourceTarget?: boolean;
    singleDestinationTarget?: boolean;
}
/**
 * Generic helper for text like:
 * "Move X damage counters from Y to Z."
 */
export declare function MOVE_DAMAGE_COUNTERS(store: StoreLike, state: State, player: Player, options?: MoveDamageCountersOptions): State;
export declare type TopDeckRemainderDestination = 'shuffle' | 'bottom' | 'discard' | 'lostzone';
export interface LookAtTopXCardsAndDoWithMatchingOptions {
    topCount: number;
    maxMatches: number;
    filter?: Partial<Card>;
    predicate?: (card: Card) => boolean;
    chooseMessage?: GameMessage;
    allowCancel?: boolean;
    remainderDestination?: TopDeckRemainderDestination;
    onCardsChosen: (chosenCards: Card[], topCards: CardList) => void;
}
/**
 * Core engine for "Look at the top X cards..." effects.
 *
 * Note: `onCardsChosen` is intended for synchronous card moves. If your effect
 * needs additional prompts (for example target selection), use the dedicated
 * wrapper helpers below instead.
 */
export declare function LOOK_AT_TOP_X_CARDS_AND_DO_WITH_MATCHING(store: StoreLike, state: State, player: Player, options: LookAtTopXCardsAndDoWithMatchingOptions): State;
export interface LookAtTopXCardsAndPutUpToYMatchingCardsIntoHandOptions {
    filter?: Partial<Card>;
    predicate?: (card: Card) => boolean;
    revealChosenCards?: boolean;
    remainderDestination?: TopDeckRemainderDestination;
    sourceCard?: Card;
    sourceEffect?: any;
}
/**
 * Compound helper for text like:
 * "Look at the top X cards of your deck, put up to Y matching cards into your hand,
 * and move the rest [shuffle/bottom/discard/lostzone]."
 */
export declare function LOOK_AT_TOP_X_CARDS_AND_PUT_UP_TO_Y_MATCHING_CARDS_INTO_HAND(store: StoreLike, state: State, player: Player, topCount: number, maxToHand: number, options?: LookAtTopXCardsAndPutUpToYMatchingCardsIntoHandOptions): State;
export interface LookAtTopXCardsAndAttachUpToYEnergyOptions {
    destinationSlots?: SlotType[];
    targetFilter?: (target: PokemonCardList, pokemonCard: PokemonCard) => boolean;
    energyFilter?: Partial<EnergyCard>;
    remainderDestination?: TopDeckRemainderDestination;
    differentTypes?: boolean;
    differentTargets?: boolean;
    sameTarget?: boolean;
    validCardTypes?: CardType[];
    maxPerType?: number;
    maxPokemonTargets?: number;
}
/**
 * Compound helper for text like:
 * "Look at the top X cards of your deck and attach up to Y matching Energy cards
 * to your Pokémon in play."
 */
export declare function LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY(store: StoreLike, state: State, player: Player, topCount: number, maxEnergyToAttach: number, options?: LookAtTopXCardsAndAttachUpToYEnergyOptions): State;
export interface LookAtTopXCardsAndBenchUpToYMatchingPokemonOptions {
    filter?: Partial<PokemonCard>;
    predicate?: (card: PokemonCard) => boolean;
    remainderDestination?: TopDeckRemainderDestination;
}
/**
 * Compound helper for text like:
 * "Look at the top X cards of your deck and put up to Y matching Pokémon onto your Bench."
 */
export declare function LOOK_AT_TOP_X_CARDS_AND_BENCH_UP_TO_Y_POKEMON(store: StoreLike, state: State, player: Player, topCount: number, maxToBench: number, options?: LookAtTopXCardsAndBenchUpToYMatchingPokemonOptions): State;
export declare function LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN(store: StoreLike, state: State, choosingPlayer: Player, deckPlayer: Player): void;
export declare function MOVE_CARDS_TO_HAND(store: StoreLike, state: State, player: Player, cards: Card[]): void;
export declare function SHOW_CARDS_TO_PLAYER(store: StoreLike, state: State, player: Player, cards: Card[]): State;
export declare function SELECT_PROMPT(store: StoreLike, state: State, player: Player, values: string[], callback: (result: number) => void): State;
export declare function SELECT_PROMPT_WITH_OPTIONS(store: StoreLike, state: State, player: Player, message: GameMessage, options: {
    message: GameMessage;
    action: () => void;
}[]): State;
export declare function CONFIRMATION_PROMPT(store: StoreLike, state: State, player: Player, callback: (result: boolean) => void, message?: GameMessage): State;
export declare function COIN_FLIP_PROMPT(store: StoreLike, state: State, player: Player, callback: (result: boolean) => void): State;
export declare function MULTIPLE_COIN_FLIPS_PROMPT(store: StoreLike, state: State, player: Player, amount: number, callback: (results: boolean[]) => void): State;
/**
 * Reusable "flip coins until tails" helper.
 * Returns the number of heads via callback.
 */
export declare function FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store: StoreLike, state: State, player: Player, callback: (heads: number) => void): State;
export declare function SIMULATE_COIN_FLIP(store: StoreLike, state: State, player: Player): boolean;
export declare function GET_FIRST_PLAYER_BENCH_SLOT(player: Player): PokemonCardList;
export declare function GET_PLAYER_BENCH_SLOTS(player: Player): PokemonCardList[];
export declare function BLOCK_IF_NO_SLOTS(slots: PokemonCardList[]): void;
export declare function BLOCK_IF_DECK_EMPTY(player: Player): void;
export declare function BLOCK_IF_DISCARD_EMPTY(player: Player): void;
export declare function BLOCK_IF_GX_ATTACK_USED(player: Player): void;
/**
 * Helper for text like:
 * "This Pokémon can't use [Attack Name] during your next turn."
 *
 * Uses the built-in pending attack lock list, so no marker cleanup is required.
 */
export declare function THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN(player: Player, attack: Attack | string): void;
/**
 * Helper for text like:
 * "This Pokémon can't attack during your next turn."
 */
export declare function THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN(player: Player): void;
export declare function BLOCK_IF_HAS_SPECIAL_CONDITION(player: Player, source: Card): void;
export declare function BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player: Player, source: Card): void;
export declare function ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card, specialConditions: SpecialCondition[], poisonDamage?: number, burnDamage?: number, sleepFlips?: number, confusionDamage?: number): void;
export declare function ADD_SLEEP_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card, sleepFlips?: number): void;
export declare function ADD_POISON_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card, poisonDamage?: number): void;
export declare function ADD_BURN_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card, burnDamage?: number): void;
export declare function ADD_PARALYZED_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card): void;
export declare function ADD_CONFUSION_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card, confusionDamage?: number): void;
export interface PreventAndClearSpecialConditionsOptions {
    shouldApply: (target: PokemonCardList, owner: Player) => boolean;
    clearDuringCheckTableState?: boolean;
}
/**
 * Compound helper for text like:
 * "Pokémon that meet [condition] can't be affected by Special Conditions, and recover from them."
 *
 * Call this in reduceEffect and pass card-specific matching logic via `shouldApply`.
 */
export declare function PREVENT_AND_CLEAR_SPECIAL_CONDITIONS(state: State, effect: Effect, options: PreventAndClearSpecialConditionsOptions): void;
export declare function ADD_MARKER(marker: string, owner: Player | Card | PokemonCard | PokemonCardList, source: Card): void;
export declare function REMOVE_MARKER(marker: string, owner: Player | Card | PokemonCard | PokemonCardList, source?: Card): void;
export declare function HAS_MARKER(marker: string, owner: Player | Card | PokemonCard | PokemonCardList, source?: Card): boolean;
/**
 * Enforce "Once during your turn" for activated abilities.
 * Call this after all card-specific validation, right before applying the ability effect.
 * Pair with REMOVE_MARKER_AT_END_OF_TURN(effect, marker, source) in reduceEffect.
 */
export declare function USE_ABILITY_ONCE_PER_TURN(player: Player, marker: string, source: Card): void;
export declare function BLOCK_EFFECT_IF_MARKER(marker: string, owner: Player | Card | PokemonCard | PokemonCardList, source?: Card): void;
export declare function PREVENT_DAMAGE_IF_TARGET_HAS_MARKER(effect: Effect, marker: string, source?: Card): void;
export declare function PREVENT_DAMAGE_IF_SOURCE_HAS_TAG(effect: Effect, tag: string, source: Card): void;
export declare function HAS_TAG(tag: string, source: Card): boolean;
export declare function REMOVE_MARKER_AT_END_OF_TURN(effect: Effect, marker: string, source: Card): void;
export declare function REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect: Effect, marker: string, source: Card): void;
export declare function REPLACE_MARKER_AT_END_OF_TURN(effect: Effect, oldMarker: string, newMarker: string, source: Card): void;
/**
 * If an EndTurnEffect is given, will check for `clearerMarker` on the player whose turn it is,
 * and clear all of the player or opponent's `pokemonMarker`s.
 * Useful for "During your opponent's next turn" effects.
 */
export declare function CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state: State, effect: Effect, clearerMarker: string, pokemonMarker: string, source: Card): void;
export declare function BLOCK_RETREAT_IF_MARKER(effect: Effect, marker: string, source: Card): void;
export declare function MOVE_CARDS(store: StoreLike, state: State, source: CardList | PokemonCardList, destination: CardList | PokemonCardList, options?: {
    cards?: Card[];
    count?: number;
    toTop?: boolean;
    toBottom?: boolean;
    skipCleanup?: boolean;
    sourceCard?: Card;
    sourceEffect?: any;
}): State;
/**
 * Validates if a supporter card can be played under current game conditions
 * @param store The store instance
 * @param state The current game state
 * @param player The player attempting to play the card
 * @param trainerCard The supporter card to validate
 * @param bypassSupporterTurn If true, temporarily bypasses the supporterTurn check (for abilities that copy supporters)
 * @returns true if the card can be played, false otherwise
 */
export declare function CAN_PLAY_SUPPORTER_CARD(store: StoreLike, state: State, player: Player, trainerCard: TrainerCard, bypassSupporterTurn?: boolean): boolean;
/**
 * Validates if a trainer card can be played under current game conditions
 * Dynamically checks by attempting to execute the card's logic and catching GameError
 * @param store The store instance
 * @param state The current game state
 * @param player The player attempting to play the card
 * @param trainerCard The trainer card to validate
 * @returns true if the card can be played, false otherwise
 */
export declare function CAN_PLAY_TRAINER_CARD(store: StoreLike, state: State, player: Player, trainerCard: TrainerCard): boolean;
/**
 * Validates if an energy card can be played under current game conditions
 * NOTE: This only checks basic conditions, not card-specific requirements
 * @param store The store instance
 * @param state The current game state
 * @param player The player attempting to play the card
 * @param energyCard The energy card to validate
 * @returns true if the card can be played, false otherwise
 */
export declare function CAN_PLAY_ENERGY_CARD(store: StoreLike, state: State, player: Player, energyCard: EnergyCard): boolean;
/**
 * Validates if a pokemon card can be played under current game conditions
 * Checks basic conditions and evolution requirements
 * @param store The store instance
 * @param state The current game state
 * @param player The player attempting to play the card
 * @param pokemonCard The pokemon card to validate
 * @returns true if the card can be played, false otherwise
 */
export declare function CAN_PLAY_POKEMON_CARD(store: StoreLike, state: State, player: Player, pokemonCard: PokemonCard): boolean;
/**
 * Universal function to check if any card can be played
 * @param store The store instance
 * @param state The current game state
 * @param player The player attempting to play the card
 * @param card The card to validate
 * @returns true if the card can be played, false otherwise
 */
export declare function CAN_PLAY_CARD(store: StoreLike, state: State, player: Player, card: Card): boolean;
/**
 * Creates and reduces a prevent retreat effect for the given source card.
 * This is commonly used in Pokemon card effects that prevent the defending Pokemon from retreating.
 * @param store The store instance
 * @param state The current game state
 * @param effect The original attack effect that triggered this
 * @param source The source card that created this effect
 * @returns The updated game state
 */
export declare function BLOCK_RETREAT(store: StoreLike, state: State, effect: AttackEffect, source: Card): State;
/**
 * Creates and reduces a prevent damage effect for the given source card.
 * This is commonly used in Pokemon card effects that prevent damage during the opponent's next turn.
 * @param store The store instance
 * @param state The current game state
 * @param effect The original attack effect that triggered this
 * @param source The source card that created this effect
 * @returns The updated game state
 */
export declare function PREVENT_DAMAGE(store: StoreLike, state: State, effect: AttackEffect, source: Card): State;
/**
 * Checks if the a Pokemon is at full HP and that the damage dealt is enough to knock it out.
 * TODO: This doesn't work if the an attack changes the result of a CheckHpEffect (e.g. discards an hp-modifying stadium)
 */
export declare function DAMAGED_FROM_FULL_HP(store: StoreLike, state: State, effect: PutDamageEffect, player: Player, target: PokemonCardList): boolean;
export interface OnDamagedByOpponentAttackEvenIfKnockedOutOptions {
    source: PokemonCard;
    requireActiveSpot?: boolean;
    requireAttackPhase?: boolean;
}
/**
 * Compound helper for text like:
 * "If this Pokémon is in the Active Spot and is damaged by an opponent's attack
 * (even if this Pokémon is Knocked Out)..."
 */
export declare function ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state: State, effect: Effect, options: OnDamagedByOpponentAttackEvenIfKnockedOutOptions): effect is AfterDamageEffect;
export interface BenchProtectionOptions {
    owner: Player;
    source?: PokemonCard | TrainerCard;
    includeSourcePokemon?: boolean;
    targetFilter?: (target: PokemonCardList, pokemonCard: PokemonCard | undefined) => boolean;
    checkBlocked?: boolean;
}
/**
 * Compound helper for text like:
 * "Prevent all damage done to your other Benched Pokémon by attacks from your opponent's Pokémon."
 */
export declare function PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS(store: StoreLike, state: State, effect: Effect, options: BenchProtectionOptions): void;
/**
 * Compound helper for text like:
 * "Prevent all effects of attacks done to your other Benched Pokémon
 * by attacks from your opponent's Pokémon. (Damage is not an effect.)"
 */
export declare function PREVENT_EFFECTS_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS(store: StoreLike, state: State, effect: Effect, options: BenchProtectionOptions): void;
export interface SurviveOnTenIfFullHpOptions {
    reason: string;
    source: PokemonCard | TrainerCard;
    checkBlocked?: boolean;
}
/**
 * Compound helper for text like:
 * "If this Pokemon has full HP and would be Knocked Out by damage from an attack,
 * this Pokemon is not Knocked Out and its remaining HP becomes 10 instead."
 */
export declare function SURVIVE_ON_TEN_IF_FULL_HP(store: StoreLike, state: State, effect: Effect, options: SurviveOnTenIfFullHpOptions): void;
/**
 * Tera Rule: Prevents damage effects from being applied to non-active Pokémon.
 * This is commonly used by Tera Pokémon to prevent damage to benched Pokémon.
 * @param effect The effect being processed
 * @param state The current game state
 * @param source The source card that created this effect
 */
export declare function TERA_RULE(effect: Effect, state: State, source: Card): void;
