"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeDrawer = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const confirm_prompt_1 = require("../../game/store/prompts/confirm-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const name = effect.trainerCard.name;
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const count = player.hand.cards.reduce((sum, c) => {
        return sum + (c.name === name ? 1 : 0);
    }, 0);
    let playTwoCards = false;
    if (count >= 2) {
        yield store.prompt(state, new confirm_prompt_1.ConfirmPrompt(player.id, game_message_1.GameMessage.WANT_TO_PLAY_BOTH_CARDS_AT_ONCE), result => {
            playTwoCards = result;
            next();
        });
    }
    if (playTwoCards === false) {
        player.deck.moveTo(player.hand, 1);
        return state;
    }
    // Discard second Poke-Drawer +
    const second = player.hand.cards.find(c => {
        return c.name === name && c !== effect.trainerCard;
    });
    if (second !== undefined) {
        player.hand.moveCardTo(second, player.discard);
    }
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 2, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    // Get selected cards
    player.deck.moveCardsTo(cards, player.hand);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    // Shuffle the deck
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class PokeDrawer extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'DP';
        this.name = 'Poke Drawer +';
        this.fullName = 'Poke Drawer SF';
        this.text = 'You may play 2 Poke Drawer + at the same time. If you play 1 ' +
            'Poke Drawer +, draw a card. If you play 2 Poke Drawer +, search your ' +
            'deck for up to 2 cards, and put them into your hand. Shuffle your deck ' +
            'afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.PokeDrawer = PokeDrawer;
