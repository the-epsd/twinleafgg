"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lillie = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
class Lillie extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'UPR';
        this.name = 'Lillie';
        this.fullName = 'Lillie UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '125';
        this.text = 'Draw cards until you have 6 cards in your hand. If it\'s your first turn, draw cards until you have 8 cards in your hand. ';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (state.turn <= 2) {
                // checking if the player can even use the card
                if (player.hand.cards.length >= 8) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
                while (player.hand.cards.length < 8) {
                    if (player.deck.cards.length === 0) {
                        break;
                    }
                    player.deck.moveTo(player.hand, 1);
                }
            }
            if (state.turn > 2) {
                // checking if the player can even use the card
                if (player.hand.cards.length >= 6) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
                while (player.hand.cards.length < 6) {
                    if (player.deck.cards.length === 0) {
                        break;
                    }
                    player.deck.moveTo(player.hand, 1);
                }
            }
        }
        return state;
    }
}
exports.Lillie = Lillie;
