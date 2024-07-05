"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TropicalBeach = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class TropicalBeach extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'BWP';
        this.name = 'Tropical Beach';
        this.fullName = 'Tropical Beach BWP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.text = 'Once during each player\'s turn, that player may draw cards ' +
            'until he or she has 7 cards in his or her hand. If he or she does, ' +
            'that player\'s turn ends.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0 || player.hand.cards.length >= 7) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            const cardsToDraw = 7 - player.hand.cards.length;
            player.deck.moveTo(player.hand, cardsToDraw);
            // Log the message before turn ends.
            effect.preventDefault = true;
            store.log(state, game_message_1.GameLog.LOG_PLAYER_USES_STADIUM, { name: player.name, stadium: effect.stadium.name });
            player.stadiumUsedTurn = state.turn;
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
            return store.reduceEffect(state, endTurnEffect);
        }
        return state;
    }
}
exports.TropicalBeach = TropicalBeach;
