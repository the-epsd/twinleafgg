"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcitingStadium = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
class ExcitingStadium extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '180';
        this.name = 'Lively Stadium';
        this.fullName = 'Exciting Stadium SV8';
        this.text = 'Basic Pokémon in play get +30 HP.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const pokemonCard = effect.target;
            if (pokemonCard && pokemonCard.stage === card_types_1.Stage.BASIC) {
                effect.hp += 30;
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.ExcitingStadium = ExcitingStadium;
