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
        this.text = 'Draw cards until you have 6 cards in your hand. If it\'s your first turn, draw cards until you have 8 cards in your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const targetHandSize = state.turn <= 2 ? 8 : 6;
            if (player.hand.cards.length >= targetHandSize || player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            while (player.hand.cards.length < targetHandSize && player.deck.cards.length > 0) {
                player.deck.moveTo(player.hand, 1);
                if (player.deck.cards.length === 0) {
                    break;
                }
            }
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.Lillie = Lillie;
