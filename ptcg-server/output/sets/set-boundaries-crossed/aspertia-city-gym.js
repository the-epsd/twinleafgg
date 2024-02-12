"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AspertiaCityGym = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
class AspertiaCityGym extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'BCR';
        this.name = 'Aspertia City Gym';
        this.fullName = 'Aspertia City Gym BCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '127';
        this.text = 'Each C Pokemon in play (both yours and your opponent\'s) gets +20 HP.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.COLORLESS)) {
                effect.hp += 20;
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.AspertiaCityGym = AspertiaCityGym;
