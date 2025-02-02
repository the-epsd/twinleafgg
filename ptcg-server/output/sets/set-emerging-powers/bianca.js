"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bianca = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
class Bianca extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'EPO';
        this.name = 'Bianca';
        this.fullName = 'Bianca EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.text = 'Draw cards until you have 6 cards in your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const cards = player.hand.cards.filter(c => c !== this);
            const cardsToDraw = Math.max(0, 6 - cards.length);
            if (cardsToDraw === 0 || player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.deck.moveTo(player.hand, cardsToDraw);
        }
        return state;
    }
}
exports.Bianca = Bianca;
