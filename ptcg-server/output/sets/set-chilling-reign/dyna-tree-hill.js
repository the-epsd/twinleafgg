"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynaTreeHill = void 0;
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const check_effect_1 = require("../../game/store/effect-reducers/check-effect");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class DynaTreeHill extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '135';
        this.regulationMark = 'E';
        this.name = 'Dyna Tree Hill';
        this.fullName = 'Dyna Tree Hill CRE';
        this.text = 'Pokémon (both yours and your opponent\'s) can\'t be healed.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.HealEffect || attack_effects_1.HealTargetEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            effect.preventDefault = true;
            check_effect_1.checkState(store, state);
            if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
            }
            check_effect_1.checkState(store, state);
            return state;
        }
        return state;
    }
}
exports.DynaTreeHill = DynaTreeHill;
