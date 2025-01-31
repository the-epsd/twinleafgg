"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLOCK_EFFECT_IF_MARKER = exports.HAS_MARKER = exports.ADD_MARKER = exports.REPLACE_MARKER_AT_END_OF_TURN = exports.REMOVE_MARKER_AT_END_OF_TURN = exports.ADD_CONFUSED_TO_PLAYER_ACTIVE = exports.ADD_PARALYZED_TO_PLAYER_ACTIVE = exports.ADD_BURN_TO_PLAYER_ACTIVE = exports.ADD_POISON_TO_PLAYER_ACTIVE = exports.ADD_SLEEP_TO_PLAYER_ACTIVE = exports.ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE = exports.CONFIRMATION_PROMPT = exports.SHOW_CARDS_TO_PLAYER = exports.MOVE_CARD_TO = exports.IS_ABILITY_BLOCKED = exports.DRAW_CARDS_AS_FACE_DOWN_PRIZES = exports.DRAW_CARDS_UNTIL_CARDS_IN_HAND = exports.DRAW_CARDS = exports.SHUFFLE_PRIZES_INTO_DECK = exports.SHUFFLE_CARDS_INTO_DECK = exports.GET_PRIZES_AS_CARD_ARRAY = exports.GET_PLAYER_PRIZES = exports.DISCARD_X_ENERGY_FROM_YOUR_HAND = exports.SHUFFLE_DECK = exports.ATTACH_X_NUMBER_OF_BASIC_ENERGY_CARDS_FROM_YOUR_DISCARD_TO_YOUR_BENCHED_POKEMON = exports.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF = exports.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON = exports.TAKE_X_MORE_PRIZE_CARDS = exports.YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK = exports.THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT = exports.HEAL_X_DAMAGE_FROM_THIS_POKEMON = exports.THIS_ATTACK_DOES_X_MORE_DAMAGE = exports.FLIP_IF_HEADS = exports.DISCARD_X_ENERGY_FROM_THIS_POKEMON = exports.SEARCH_YOUR_DECK_FOR_TYPE_OF_POKEMON_AND_PUT_INTO_HAND = exports.SEARCH_YOUR_DECK_FOR_STAGE_OF_POKEMON_AND_PUT_THEM_ONTO_YOUR_BENCH = exports.DISCARD_A_STADIUM_CARD_IN_PLAY = exports.PASSIVE_ABILITY_ACTIVATED = exports.ABILITY_USED = exports.JUST_EVOLVED = exports.WAS_POWER_USED = exports.WAS_ATTACK_USED = void 0;
const __1 = require("../..");
const card_types_1 = require("../card/card-types");
const attack_effects_1 = require("../effects/attack-effects");
const check_effects_1 = require("../effects/check-effects");
const game_effects_1 = require("../effects/game-effects");
const game_phase_effects_1 = require("../effects/game-phase-effects");
/**
 *
 * A basic effect for checking the use of attacks.
 * @returns whether or not a specific attack was used.
 */
function WAS_ATTACK_USED(effect, index, user) {
    return effect instanceof game_effects_1.AttackEffect && effect.attack === user.attacks[index];
}
exports.WAS_ATTACK_USED = WAS_ATTACK_USED;
/**
 *
 * A basic effect for checking the use of abilites.
 * @returns whether or not a specific ability was used.
 */
function WAS_POWER_USED(effect, index, user) {
    return effect instanceof game_effects_1.PowerEffect && effect.power === user.powers[index];
}
exports.WAS_POWER_USED = WAS_POWER_USED;
/**
 *
 * Checks whether or not the Pokemon just evolved.
 * @returns whether or not `effect` is an evolve effect from this card.
 */
function JUST_EVOLVED(effect, card) {
    return effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === card;
}
exports.JUST_EVOLVED = JUST_EVOLVED;
/**
 * Adds the "ability used" board effect to the given Pokemon.
 */
function ABILITY_USED(player, card) {
    player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === card) {
            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
        }
    });
}
exports.ABILITY_USED = ABILITY_USED;
/**
 *
 * A basic effect for checking whether or not a passive ability gets activated.
 * @returns whether or not a passive ability was activated.
 */
function PASSIVE_ABILITY_ACTIVATED(effect, user) {
    return effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(user);
}
exports.PASSIVE_ABILITY_ACTIVATED = PASSIVE_ABILITY_ACTIVATED;
/**
 *
 * @param state is the game state.
 * @returns the game state after discarding a stadium card in play.
 */
function DISCARD_A_STADIUM_CARD_IN_PLAY(state) {
    const stadiumCard = __1.StateUtils.getStadiumCard(state);
    if (stadiumCard !== undefined) {
        const cardList = __1.StateUtils.findCardList(state, stadiumCard);
        const player = __1.StateUtils.findOwner(state, cardList);
        cardList.moveTo(player.discard);
    }
}
exports.DISCARD_A_STADIUM_CARD_IN_PLAY = DISCARD_A_STADIUM_CARD_IN_PLAY;
function SEARCH_YOUR_DECK_FOR_STAGE_OF_POKEMON_AND_PUT_THEM_ONTO_YOUR_BENCH(store, state, effect, min, max, stage) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    return store.prompt(state, new __1.ChooseCardsPrompt(player, __1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage }, { min, max: slots.length < max ? slots.length : max, allowCancel: true }), selected => {
        const cards = selected || [];
        cards.forEach((card, index) => {
            player.deck.moveCardTo(card, slots[index]);
            slots[index].pokemonPlayedTurn = state.turn;
        });
    });
}
exports.SEARCH_YOUR_DECK_FOR_STAGE_OF_POKEMON_AND_PUT_THEM_ONTO_YOUR_BENCH = SEARCH_YOUR_DECK_FOR_STAGE_OF_POKEMON_AND_PUT_THEM_ONTO_YOUR_BENCH;
/**
 * Search deck for `type` of Pokemon, show it to the opponent, put it into `player`'s hand, and shuffle `player`'s deck.
 */
function SEARCH_YOUR_DECK_FOR_TYPE_OF_POKEMON_AND_PUT_INTO_HAND(store, state, player, min, max, type) {
    if (player.deck.cards.length === 0)
        throw new __1.GameError(__1.GameMessage.NO_CARDS_IN_DECK);
    const opponent = __1.StateUtils.getOpponent(state, player);
    return store.prompt(state, new __1.ChooseCardsPrompt(player, __1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, cardType: type }, { min, max, allowCancel: true }), selected => {
        const cards = selected || [];
        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        cards.forEach(card => MOVE_CARD_TO(state, card, player.hand));
        SHUFFLE_DECK(store, state, player);
    });
}
exports.SEARCH_YOUR_DECK_FOR_TYPE_OF_POKEMON_AND_PUT_INTO_HAND = SEARCH_YOUR_DECK_FOR_TYPE_OF_POKEMON_AND_PUT_INTO_HAND;
function DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, type, amount) {
    const player = effect.player;
    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
    state = store.reduceEffect(state, checkProvidedEnergy);
    const energyList = [];
    for (let i = 0; i < amount; i++) {
        energyList.push(type);
    }
    state = store.prompt(state, new __1.ChooseEnergyPrompt(player.id, __1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, energyList, { allowCancel: false }), energy => {
        const cards = (energy || []).map(e => e.card);
        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        return store.reduceEffect(state, discardEnergy);
    });
    return state;
}
exports.DISCARD_X_ENERGY_FROM_THIS_POKEMON = DISCARD_X_ENERGY_FROM_THIS_POKEMON;
function FLIP_IF_HEADS() {
    console.log('Heads again!');
}
exports.FLIP_IF_HEADS = FLIP_IF_HEADS;
function THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, damage) {
    effect.damage += damage;
    return state;
}
exports.THIS_ATTACK_DOES_X_MORE_DAMAGE = THIS_ATTACK_DOES_X_MORE_DAMAGE;
function HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, damage) {
    const player = effect.player;
    const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, damage);
    healTargetEffect.target = player.active;
    state = store.reduceEffect(state, healTargetEffect);
    return state;
}
exports.HEAL_X_DAMAGE_FROM_THIS_POKEMON = HEAL_X_DAMAGE_FROM_THIS_POKEMON;
function THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect, user) {
    // TODO: Would like to check if Pokemon has damage without needing the effect
    const player = effect.player;
    const source = player.active;
    // Check if source Pokemon has damage
    const damage = source.damage;
    return damage > 0;
}
exports.THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT = THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT;
function YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK(effect, state) {
    // TODO: this shouldn't work for attacks with damage counters, but I think it will
    return effect instanceof game_effects_1.KnockOutEffect;
}
exports.YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK = YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK;
function TAKE_X_MORE_PRIZE_CARDS(effect, state) {
    effect.prizeCount += 1;
    return state;
}
exports.TAKE_X_MORE_PRIZE_CARDS = TAKE_X_MORE_PRIZE_CARDS;
function THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON(damage, effect, store, state, min, max) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const targets = opponent.bench.filter(b => b.cards.length > 0);
    if (targets.length === 0) {
        return state;
    }
    return store.prompt(state, new __1.ChoosePokemonPrompt(player.id, __1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, __1.PlayerType.TOP_PLAYER, [__1.SlotType.BENCH], { min: min, max: max, allowCancel: false }), selected => {
        const target = selected[0];
        const damageEffect = new attack_effects_1.PutDamageEffect(effect, damage);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
    });
}
exports.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON = THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON;
function THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect) {
    const dealDamage = new attack_effects_1.DealDamageEffect(effect, 30);
    dealDamage.target = effect.source;
    return store.reduceEffect(state, dealDamage);
}
exports.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF = THIS_POKEMON_DOES_DAMAGE_TO_ITSELF;
function ATTACH_X_NUMBER_OF_BASIC_ENERGY_CARDS_FROM_YOUR_DISCARD_TO_YOUR_BENCHED_POKEMON(effect, store, state, amount) {
    const player = effect.player;
    state = store.prompt(state, new __1.AttachEnergyPrompt(player.id, __1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, __1.PlayerType.BOTTOM_PLAYER, [__1.SlotType.BENCH, __1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: true, min: amount, max: amount }), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
            return state;
        }
        for (const transfer of transfers) {
            const target = __1.StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target);
        }
    });
}
exports.ATTACH_X_NUMBER_OF_BASIC_ENERGY_CARDS_FROM_YOUR_DISCARD_TO_YOUR_BENCHED_POKEMON = ATTACH_X_NUMBER_OF_BASIC_ENERGY_CARDS_FROM_YOUR_DISCARD_TO_YOUR_BENCHED_POKEMON;
function SHUFFLE_DECK(store, state, player) {
    return store.prompt(state, new __1.ShuffleDeckPrompt(player.id), order => player.deck.applyOrder(order));
}
exports.SHUFFLE_DECK = SHUFFLE_DECK;
function DISCARD_X_ENERGY_FROM_YOUR_HAND(effect, store, state, minAmount, maxAmount) {
    const player = effect.player;
    const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof __1.EnergyCard;
    });
    if (!hasEnergyInHand) {
        throw new __1.GameError(__1.GameMessage.CANNOT_USE_POWER);
    }
    return store.prompt(state, new __1.ChooseCardsPrompt(player, __1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: minAmount, max: maxAmount }), cards => {
        cards = cards || [];
        if (cards.length === 0) {
            return;
        }
        player.hand.moveCardsTo(cards, player.discard);
    });
}
exports.DISCARD_X_ENERGY_FROM_YOUR_HAND = DISCARD_X_ENERGY_FROM_YOUR_HAND;
/**
 * A getter for the player's prize slots.
 * @returns A list of card lists containing the player's prize slots.
 */
function GET_PLAYER_PRIZES(player) {
    return player.prizes.filter(p => p.cards.length > 0);
}
exports.GET_PLAYER_PRIZES = GET_PLAYER_PRIZES;
/**
 * A getter for all of a player's prizes.
 * @returns A Card[] of all the player's prize cards.
 */
function GET_PRIZES_AS_CARD_ARRAY(player) {
    const prizes = player.prizes.filter(p => p.cards.length > 0);
    const allPrizeCards = [];
    prizes.forEach(p => allPrizeCards.push(...p.cards));
    return allPrizeCards;
}
exports.GET_PRIZES_AS_CARD_ARRAY = GET_PRIZES_AS_CARD_ARRAY;
/**
 * Puts a list of cards into the deck, then shuffles the deck.
 */
function SHUFFLE_CARDS_INTO_DECK(store, state, player, cards) {
    cards.forEach(card => {
        player.deck.cards.unshift(card);
    });
    SHUFFLE_DECK(store, state, player);
}
exports.SHUFFLE_CARDS_INTO_DECK = SHUFFLE_CARDS_INTO_DECK;
/**
 * Shuffle the prize cards into the deck.
 */
function SHUFFLE_PRIZES_INTO_DECK(store, state, player) {
    SHUFFLE_CARDS_INTO_DECK(store, state, player, GET_PRIZES_AS_CARD_ARRAY(player));
    GET_PLAYER_PRIZES(player).forEach(p => p.cards = []);
}
exports.SHUFFLE_PRIZES_INTO_DECK = SHUFFLE_PRIZES_INTO_DECK;
/**
 * Draws `count` cards, putting them into your hand.
 */
function DRAW_CARDS(player, count) {
    player.deck.moveTo(player.hand, Math.min(count, player.deck.cards.length));
}
exports.DRAW_CARDS = DRAW_CARDS;
/**
 * Draws cards until you have `count` cards in hand.
 */
function DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, count) {
    player.deck.moveTo(player.hand, Math.max(count - player.hand.cards.length, 0));
}
exports.DRAW_CARDS_UNTIL_CARDS_IN_HAND = DRAW_CARDS_UNTIL_CARDS_IN_HAND;
/**
 * Draws `count` cards from the top of your deck as face down prize cards.
 */
function DRAW_CARDS_AS_FACE_DOWN_PRIZES(player, count) {
    // Draw cards from the top of the deck to the prize cards
    for (let i = 0; i < count; i++) {
        const card = player.deck.cards.pop();
        if (card) {
            const prize = player.prizes.find(p => p.cards.length === 0);
            if (prize) {
                prize.cards.push(card);
            }
            else {
                player.deck.cards.push(card);
            }
        }
    }
    // Set the new prize cards to be face down
    player.prizes.forEach(p => p.isSecret = true);
}
exports.DRAW_CARDS_AS_FACE_DOWN_PRIZES = DRAW_CARDS_AS_FACE_DOWN_PRIZES;
/**
 * Checks if abilities are blocked on `card` for `player`.
 * @returns `true` if the ability is blocked, `false` if the ability is able to go thru.
 */
function IS_ABILITY_BLOCKED(store, state, player, card) {
    // Try to reduce PowerEffect, to check if something is blocking our ability
    try {
        store.reduceEffect(state, new game_effects_1.PowerEffect(player, {
            name: 'test',
            powerType: __1.PowerType.ABILITY,
            text: ''
        }, card));
    }
    catch (_a) {
        return true;
    }
    return false;
}
exports.IS_ABILITY_BLOCKED = IS_ABILITY_BLOCKED;
/**
 * Finds `card` and moves it from its current CardList to `destination`.
 */
function MOVE_CARD_TO(state, card, destination) {
    __1.StateUtils.findCardList(state, card).moveCardTo(card, destination);
}
exports.MOVE_CARD_TO = MOVE_CARD_TO;
function SHOW_CARDS_TO_PLAYER(store, state, player, cards) {
    if (cards.length === 0)
        return state;
    return store.prompt(state, new __1.ShowCardsPrompt(player.id, __1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => { });
}
exports.SHOW_CARDS_TO_PLAYER = SHOW_CARDS_TO_PLAYER;
function CONFIRMATION_PROMPT(store, state, player, callback) {
    return store.prompt(state, new __1.ConfirmPrompt(player.id, __1.GameMessage.WANT_TO_USE_ABILITY), callback);
}
exports.CONFIRMATION_PROMPT = CONFIRMATION_PROMPT;
//#region Special Conditions
function ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, specialConditions, poisonDamage = 10, burnDamage = 20, sleepFlips = 1) {
    store.reduceEffect(state, new check_effects_1.AddSpecialConditionsPowerEffect(player, source, player.active, specialConditions, poisonDamage, burnDamage, sleepFlips));
}
exports.ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE = ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE;
function ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, source, sleepFlips = 1) {
    ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [card_types_1.SpecialCondition.ASLEEP], 10, 20, sleepFlips);
}
exports.ADD_SLEEP_TO_PLAYER_ACTIVE = ADD_SLEEP_TO_PLAYER_ACTIVE;
function ADD_POISON_TO_PLAYER_ACTIVE(store, state, player, source, poisonDamage = 10) {
    ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [card_types_1.SpecialCondition.POISONED], poisonDamage);
}
exports.ADD_POISON_TO_PLAYER_ACTIVE = ADD_POISON_TO_PLAYER_ACTIVE;
function ADD_BURN_TO_PLAYER_ACTIVE(store, state, player, source, burnDamage = 20) {
    ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [card_types_1.SpecialCondition.BURNED], 10, burnDamage);
}
exports.ADD_BURN_TO_PLAYER_ACTIVE = ADD_BURN_TO_PLAYER_ACTIVE;
function ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, player, source) {
    ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [card_types_1.SpecialCondition.PARALYZED]);
}
exports.ADD_PARALYZED_TO_PLAYER_ACTIVE = ADD_PARALYZED_TO_PLAYER_ACTIVE;
function ADD_CONFUSED_TO_PLAYER_ACTIVE(store, state, player, source) {
    ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [card_types_1.SpecialCondition.CONFUSED]);
}
exports.ADD_CONFUSED_TO_PLAYER_ACTIVE = ADD_CONFUSED_TO_PLAYER_ACTIVE;
//#endregion
//#region Markers
function REMOVE_MARKER_AT_END_OF_TURN(effect, source, marker) {
    if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(marker, source))
        effect.player.marker.removeMarker(marker, source);
}
exports.REMOVE_MARKER_AT_END_OF_TURN = REMOVE_MARKER_AT_END_OF_TURN;
function REPLACE_MARKER_AT_END_OF_TURN(effect, source, oldMarker, newMarker) {
    if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(oldMarker, source)) {
        effect.player.marker.removeMarker(oldMarker, source);
        effect.player.marker.addMarker(newMarker, source);
    }
}
exports.REPLACE_MARKER_AT_END_OF_TURN = REPLACE_MARKER_AT_END_OF_TURN;
function ADD_MARKER(player, source, marker) {
    player.marker.addMarker(marker, source);
}
exports.ADD_MARKER = ADD_MARKER;
function HAS_MARKER(player, source, marker) {
    return player.marker.hasMarker(marker, source);
}
exports.HAS_MARKER = HAS_MARKER;
function BLOCK_EFFECT_IF_MARKER(player, card, marker) {
    if (player.marker.hasMarker(marker, card)) {
        throw new __1.GameError(__1.GameMessage.BLOCKED_BY_EFFECT);
    }
}
exports.BLOCK_EFFECT_IF_MARKER = BLOCK_EFFECT_IF_MARKER;
//#endregion
