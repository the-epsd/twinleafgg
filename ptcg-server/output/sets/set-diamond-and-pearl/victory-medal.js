"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VictoryMedal = void 0;
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let coinResults = [];
    yield store.prompt(state, [
        new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP),
        new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
    ], results => {
        coinResults = results;
        next();
    });
    if (coinResults.every(r => r === true)) {
        let cards = [];
        yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, allowCancel: false }), selected => {
            cards = selected;
            next();
        });
        // Get selected cards
        player.deck.moveCardsTo(cards, player.hand);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        // Shuffle the deck
        yield store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            next();
        });
        return state;
    }
    if (coinResults.some(r => r === true)) {
        // Get selected cards
        player.deck.moveTo(player.hand, 1);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class VictoryMedal extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'DP';
        this.name = 'Victory Medal';
        this.fullName = 'Victory Medal PR';
        this.text = 'Flip 2 coins. If one of them is heads, draw a card. If both are heads, ' +
            'search your deck for any 1 card, put it into your hand, and shuffle ' +
            'your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.VictoryMedal = VictoryMedal;
