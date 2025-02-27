"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sightseer = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sightseer extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '189';
        this.name = 'Sightseer';
        this.fullName = 'Sightseer LOT';
        this.text = 'You may discard any number of cards from your hand. Then, draw cards until you have 5 cards in your hand. ' +
            'If you can\'t draw any cards in this way, you can\'t play this card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            prefabs_1.BLOCK_IF_DECK_EMPTY(player);
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: Math.max(0, player.hand.cards.length - 4), max: player.hand.cards.length, allowCancel: false }), (selected) => {
                const cards = selected || [];
                if (cards.length > 0) {
                    prefabs_1.MOVE_CARDS(store, state, player.hand, player.discard, { cards });
                }
                prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 5);
            });
        }
        return state;
    }
}
exports.Sightseer = Sightseer;
