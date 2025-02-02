"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YellHorn = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class YellHorn extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.name = 'Yell Horn';
        this.trainerType = game_1.TrainerType.ITEM;
        this.fullName = 'Yell Horn DAA';
        this.set = 'DAA';
        this.setNumber = '173';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.text = 'Both Active Pokémon are now Confused.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.addSpecialCondition(game_1.SpecialCondition.CONFUSED);
            opponent.active.addSpecialCondition(game_1.SpecialCondition.CONFUSED);
            return state;
        }
        return state;
    }
}
exports.YellHorn = YellHorn;
