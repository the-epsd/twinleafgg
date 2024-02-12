"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteelShelter = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class SteelShelter extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PHF';
        this.name = 'Steel Shelter';
        this.fullName = 'Steel Shelter PFO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.text = 'Each M Pokemon (both yours and your opponent\'s) can\'t be affected ' +
            'by any Special Conditions. (Remove any Special Conditions affecting ' +
            'those Pokemon.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            state.players.forEach(player => {
                if (player.active.specialConditions.length === 0) {
                    return;
                }
                const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
                store.reduceEffect(state, checkPokemonTypeEffect);
                if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.METAL)) {
                    const conditions = player.active.specialConditions.slice();
                    conditions.forEach(condition => {
                        player.active.removeSpecialCondition(condition);
                    });
                }
            });
            return state;
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.SteelShelter = SteelShelter;
