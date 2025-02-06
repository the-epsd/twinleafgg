"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkatersPark = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
class SkatersPark extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'E';
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '242';
        this.name = 'Skaters\' Park';
        this.fullName = 'Skaters\' Park FST';
        this.text = 'Whenever either player\'s Active Pokémon retreats, put any basic Energy ' +
            'that would be discarded into their hand instead of the discard pile.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.RetreatEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            effect.moveRetreatCostTo = effect.player.hand;
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.SkatersPark = SkatersPark;
