"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraniteCave = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class GraniteCave extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'I';
        this.set = 'SVOD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Granite Cave';
        this.fullName = 'Granite Cave SVOD';
        this.text = 'Steven\'s Pokémon (both yours and your opponent\'s) take 30 less damage from attacks from the opponent\'s Pokémon (after applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const card = effect.target.getPokemonCard();
            if (card.tags.includes(card_types_1.CardTag.STEVENS)) {
                effect.damage = Math.max(0, effect.damage - 30);
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.GraniteCave = GraniteCave;
