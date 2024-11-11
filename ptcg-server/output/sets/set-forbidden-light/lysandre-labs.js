"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LysandreLabs = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class LysandreLabs extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '111';
        this.name = 'Lysandre Labs';
        this.fullName = 'Lysandre Labs FLI';
        this.text = ' Pokémon Tool cards in play (both yours and your opponent\'s) have no effect.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.ToolEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            // effect.preventDefault = true;
            // effect.card.provides = [CardType.COLORLESS];
            effect.preventDefault = true;
            console.log('Lysandre Labs blocks Tool Effect');
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.LysandreLabs = LysandreLabs;
