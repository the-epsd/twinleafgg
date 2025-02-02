"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapsedStadium = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class CollapsedStadium extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'F';
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137';
        this.name = 'Collapsed Stadium';
        this.fullName = 'Collapsed Stadium BRS';
        this.text = 'Each player can’t have more than 4 Benched Pokémon. ' +
            'If a player has 5 or more Benched Pokémon, they ' +
            'discard Benched Pokémon until they have 4 Pokémon ' +
            'on the Bench. The player who played this card discards ' +
            'first. If more than one effect changes the number of ' +
            'Benched Pokémon allowed, use the smaller number.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            effect.benchSizes = [4, 4];
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.CollapsedStadium = CollapsedStadium;
