"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHUFFLE_DECK = exports.TRAINER_SHOW_OPPONENT_CARDS = exports.DISCARD_X_CARDS_FROM_YOUR_HAND = void 0;
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const card_1 = require("../card/card");
const choose_cards_prompt_1 = require("../prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../prompts/shuffle-prompt");
const state_utils_1 = require("../state-utils");
function DISCARD_X_CARDS_FROM_YOUR_HAND(effect, store, state, minAmount, maxAmount) {
    const player = effect.player;
    let cards = [];
    cards = player.hand.cards.filter(c => c !== effect.trainerCard);
    const hasCardInHand = player.hand.cards.some(c => {
        return c instanceof card_1.Card;
    });
    if (!hasCardInHand) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (cards.length == maxAmount) {
        player.hand.moveCardsTo(player.hand.cards, player.discard);
    }
    if (cards.length > maxAmount) {
        state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(effect.player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: minAmount, max: maxAmount }), cards => {
            cards = cards || [];
            if (cards.length === 0) {
                return;
            }
            player.hand.moveCardsTo(cards, player.discard);
            cards.forEach((card, index) => {
                store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
            });
        });
    }
}
exports.DISCARD_X_CARDS_FROM_YOUR_HAND = DISCARD_X_CARDS_FROM_YOUR_HAND;
function TRAINER_SHOW_OPPONENT_CARDS(effect, store, state) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const cards = [];
    if (cards.length > 0) {
        store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => { });
    }
}
exports.TRAINER_SHOW_OPPONENT_CARDS = TRAINER_SHOW_OPPONENT_CARDS;
function SHUFFLE_DECK(effect, store, state) {
    const player = effect.player;
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
exports.SHUFFLE_DECK = SHUFFLE_DECK;
