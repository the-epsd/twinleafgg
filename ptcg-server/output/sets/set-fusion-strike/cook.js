"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cook = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Cook extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '228';
        this.regulationMark = 'E';
        this.name = 'Cook';
        this.fullName = 'Cook FST';
        this.text = 'Heal 70 damage from your Active Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const healEffect = new game_effects_1.HealEffect(effect.player, effect.player.active, 70);
            return store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Cook = Cook;
