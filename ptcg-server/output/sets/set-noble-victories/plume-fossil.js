"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlumeFossil = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const card_list_1 = require("../../game/store/state/card-list");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const slots = player.bench.filter(b => b.cards.length === 0);
    const max = Math.min(slots.length, 1);
    const start = player.deck.cards.length < 7 ? 0 : player.deck.cards.length - 7;
    const end = player.deck.cards.length;
    const deckBottom = new card_list_1.CardList();
    deckBottom.cards = player.deck.cards.slice(start, end);
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, deckBottom, { superType: card_types_1.SuperType.POKEMON, name: 'Archen' }, { min: 0, max, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > slots.length) {
        cards.length = slots.length;
    }
    cards.forEach((card, index) => {
        player.deck.moveCardTo(card, slots[index]);
        slots[index].pokemonPlayedTurn = state.turn;
    });
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class PlumeFossil extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'NVI';
        this.name = 'Plume Fossil';
        this.fullName = 'Plume Fossil NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.text = 'Look at the bottom 7 cards of your deck. You may reveal an Archen ' +
            'you find there and put is onto your Bench. Shuffle the other cards back ' +
            'into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.PlumeFossil = PlumeFossil;
