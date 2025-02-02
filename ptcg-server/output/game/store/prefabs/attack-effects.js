"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED = exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED = exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED = exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED = exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP = exports.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON = exports.THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE = exports.SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK = exports.PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON = exports.PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND = exports.HEAL_X_DAMAGE_FROM_THIS_POKEMON = exports.DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND = exports.DISCARD_A_STADIUM_CARD_IN_PLAY = void 0;
const pokemon_card_1 = require("../card/pokemon-card");
const __1 = require("../..");
const attack_effects_1 = require("../effects/attack-effects");
const __2 = require("../..");
const card_types_1 = require("../card/card-types");
const attack_effects_2 = require("../effects/attack-effects");
const card_types_2 = require("../card/card-types");
const __3 = require("../..");
/**
 * These prefabs are for general attack effects.
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
function DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND(x, effect, state) {
    const player = effect.player;
    const cardsToDraw = x - player.hand.cards.length;
    if (cardsToDraw <= 0) {
        return state;
    }
    player.deck.moveTo(player.hand, cardsToDraw);
}
exports.DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND = DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND;
function HEAL_X_DAMAGE_FROM_THIS_POKEMON(damage, effect, store, state) {
    const player = effect.player;
    const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, damage);
    healTargetEffect.target = player.active;
    state = store.reduceEffect(state, healTargetEffect);
}
exports.HEAL_X_DAMAGE_FROM_THIS_POKEMON = HEAL_X_DAMAGE_FROM_THIS_POKEMON;
function PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND(x, filterFn = () => true, store, state, effect) {
    const player = effect.player;
    const cardCount = player.discard.cards.filter(filterFn).length;
    if (cardCount === 0) {
        return state;
    }
    const max = Math.min(x, cardCount);
    const min = max;
    return store.prompt(state, [
        new __3.ChooseCardsPrompt(player, __2.GameMessage.CHOOSE_CARD_TO_HAND, 
        // TODO: Make this work for more than just Items!
        player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min, max, allowCancel: false })
    ], selected => {
        const cards = selected || [];
        player.discard.moveCardsTo(cards, player.hand);
    });
}
exports.PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND = PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND;
function PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(x, store, state, effect) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const putCounters = new attack_effects_1.PutCountersEffect(effect, 10 * x);
    putCounters.target = opponent.active;
    return store.reduceEffect(state, putCounters);
}
exports.PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON = PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON;
function SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect) {
    const player = effect.player;
    player.active.moveTo(player.deck);
    player.active.clearEffects();
    return store.prompt(state, new __3.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
exports.SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK = SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK;
function THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE(damage, filterFn = () => true, effect) {
    const player = effect.player;
    let pokemonCount = 0;
    player.discard.cards.forEach(c => {
        if (c instanceof pokemon_card_1.PokemonCard && filterFn(c)) {
            pokemonCount += 1;
        }
    });
    effect.damage = pokemonCount * damage;
}
exports.THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE = THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE;
function THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(damage, effect, store, state) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const targets = opponent.bench.filter(b => b.cards.length > 0);
    if (targets.length === 0) {
        return state;
    }
    return store.prompt(state, new __2.ChoosePokemonPrompt(player.id, __2.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, __2.PlayerType.TOP_PLAYER, [__2.SlotType.BENCH]), selected => {
        const target = selected[0];
        const damageEffect = new attack_effects_1.PutDamageEffect(effect, damage);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
    });
}
exports.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON = THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON;
function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect) {
    const specialConditionEffect = new attack_effects_2.AddSpecialConditionsEffect(effect, [card_types_2.SpecialCondition.ASLEEP]);
    store.reduceEffect(state, specialConditionEffect);
}
exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP = YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP;
function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect) {
    const specialConditionEffect = new attack_effects_2.AddSpecialConditionsEffect(effect, [card_types_2.SpecialCondition.BURNED]);
    store.reduceEffect(state, specialConditionEffect);
}
exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED = YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED;
function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect) {
    const specialConditionEffect = new attack_effects_2.AddSpecialConditionsEffect(effect, [card_types_2.SpecialCondition.CONFUSED]);
    store.reduceEffect(state, specialConditionEffect);
}
exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED = YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED;
function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect) {
    const specialConditionEffect = new attack_effects_2.AddSpecialConditionsEffect(effect, [card_types_2.SpecialCondition.PARALYZED]);
    store.reduceEffect(state, specialConditionEffect);
}
exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED = YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED;
function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect) {
    const specialConditionEffect = new attack_effects_2.AddSpecialConditionsEffect(effect, [card_types_2.SpecialCondition.POISONED]);
    store.reduceEffect(state, specialConditionEffect);
}
exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED = YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED;
