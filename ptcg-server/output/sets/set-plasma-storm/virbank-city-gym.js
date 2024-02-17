"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirbankCityGym = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class VirbankCityGym extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PLS';
        this.name = 'Virbank City Gym';
        this.fullName = 'Virbank City Gym PLS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '126';
        this.text = 'Put 2 more damage counters on Poisoned Pokemon (both yours and your ' +
            'opponent\'s) between turns.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            effect.poisonDamage += 20;
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.VirbankCityGym = VirbankCityGym;
