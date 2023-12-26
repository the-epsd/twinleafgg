"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokeball = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    let coinResult = false;
    yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), (result) => {
        coinResult = result;
        next();
    });
    if (coinResult) {
        let cards = [];
        yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false }), (selected) => {
            cards = selected || [];
            next();
        });
        player.deck.moveCardsTo(cards, player.hand);
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), (order) => {
        player.deck.applyOrder(order);
    });
}
class Pokeball extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '185';
        this.name = 'Pokéball';
        this.fullName = 'Pokéball SVI 185';
        this.text = 'Discard 2 cards from your hand. (If you can\'t discard 2 cards, ' +
            'you can\'t play this card.) Search your deck for a card and put it into ' +
            'your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Pokeball = Pokeball;
