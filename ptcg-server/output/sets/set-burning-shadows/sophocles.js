"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sophocles = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    let cards = [];
    console.log('we in');
    if (player.hand.cards.length <= 1) {
        console.log('you apparently don\'t have enough cards');
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 2, max: 2 }), selected => {
        cards = selected || [];
        next();
    });
    player.hand.moveCardsTo(cards, player.discard);
    player.deck.moveTo(player.hand, 4);
}
class Sophocles extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'BUS';
        this.setNumber = '123';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sophocles';
        this.fullName = 'Sophocles BUS';
        this.text = 'Discard 2 cards from your hand. If you do, draw 4 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            console.log('it did reach this');
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Sophocles = Sophocles;
