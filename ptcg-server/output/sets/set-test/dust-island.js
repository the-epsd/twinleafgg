"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DustIsland = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class DustIsland extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.cardImage = 'https://assets.pokemon.com/assets/cms2/img/cards/web/SM10/SM10_EN_168.png';
        this.setNumber = '1';
        this.trainerType = game_1.TrainerType.STADIUM;
        this.set = 'TEST';
        this.name = 'Dust Island';
        this.fullName = 'Dust Island TEST';
        this.text = 'Whenever either player switches their Poisoned Active Pokémon with 1 of their Benched Pokémon with the effect of a Trainer card, the new Active Pokémon is now affected by that Special Condition.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.DustIsland = DustIsland;
