"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowCircle = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class ShadowCircle extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'XY';
        this.name = 'Shadow Circle';
        this.fullName = 'Shadow Circle XY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '126';
        this.text = 'Each Pokemon that has any [D] Energy attached to it (both yours ' +
            'and your opponent\'s) has no Weakness.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const target = effect.target;
            const player = state_utils_1.StateUtils.findOwner(state, target);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, target);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyMap = checkProvidedEnergyEffect.energyMap;
            const hasDarknessEnergy = state_utils_1.StateUtils.checkEnoughEnergy(energyMap, [card_types_1.CardType.DARK]);
            if (hasDarknessEnergy) {
                effect.weakness = [];
            }
            return state;
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.ShadowCircle = ShadowCircle;
