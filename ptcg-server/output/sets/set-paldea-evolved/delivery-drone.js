"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryDrone = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    let coin1Result = false;
    let coin2Result = false;
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), (result) => {
        coin1Result = result;
        next();
    });
    yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), (result) => {
        coin2Result = result;
        next();
    });
    if (coin1Result && coin2Result) {
        let cards = [];
        yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 1, allowCancel: false }), (selected) => {
            cards = selected || [];
            next();
        });
        player.deck.moveCardsTo(cards, player.hand);
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), (order) => {
        player.deck.applyOrder(order);
    });
}
class DeliveryDrone extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '178';
        this.name = 'Delivery Drone';
        this.fullName = 'Delivery Drone PAL';
        this.text = 'Flip 2 coins. If both of them are heads, search your deck for a card and put it into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.DeliveryDrone = DeliveryDrone;
