"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempleofSinnoh = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class TempleofSinnoh extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '155';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'ASR';
        this.name = 'Temple of Sinnoh';
        this.fullName = 'Temple of Sinnoh ASR';
        this.text = 'All Special Energy attached to Pokémon (both yours and your opponent\'s) provide C Energy and have no other effect.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.TempleofSinnoh = TempleofSinnoh;
