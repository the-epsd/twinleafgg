"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DimensionValley = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class DimensionValley extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PHF';
        this.name = 'Dimension Valley';
        this.fullName = 'Dimension Valley PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.text = 'Each P Pokemon\'s attacks (both yours and your opponent\'s) cost C less.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            // No cost to reduce
            if (index === -1) {
                return state;
            }
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.PSYCHIC)) {
                effect.cost.splice(index, 1);
            }
            return state;
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.DimensionValley = DimensionValley;
