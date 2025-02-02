"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AetherParadiseConvserationArea = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class AetherParadiseConvserationArea extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '116';
        this.name = 'Aether Paradise Conservation Area';
        this.fullName = 'Aether Paradise Conservation Area GRI';
        this.text = 'Basic [G] Pokémon and Basic [L] Pokémon (both yours and your opponent\'s) take 30 less damage from the opponent\'s attacks (after applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if ((checkPokemonType.cardTypes.includes(card_types_1.CardType.GRASS) || checkPokemonType.cardTypes.includes(card_types_1.CardType.LIGHTNING)) &&
                effect.target.stage === card_types_1.Stage.BASIC) {
                effect.damage = Math.max(0, effect.damage - 30);
                effect.damageReduced = true;
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.AetherParadiseConvserationArea = AetherParadiseConvserationArea;
