"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkyField = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class SkyField extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'ROS';
        this.name = 'Sky Field';
        this.fullName = 'Sky Field ROS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
        this.text = 'Each player can have 8 Pokemon on his or her Bench. (When this card ' +
            'leaves play, each player discards Benched Pokemon until he or she has ' +
            '5 Pokemon on the Bench. The owner of this card discard first.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            effect.benchSizes = [8, 8];
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.SkyField = SkyField;
