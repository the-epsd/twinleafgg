"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpicySeasonedCurry = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class SpicySeasonedCurry extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
        this.regulationMark = 'E';
        this.name = 'Spicy Seasoned Curry';
        this.fullName = 'Spicy Seasoned Curry ASR';
        this.text = 'Your Active Pokémon is now Burned. Heal 40 damage from it.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const playerActive = player.active;
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            playerActive.specialConditions.push(game_1.SpecialCondition.BURNED);
            store.reduceEffect(state, new game_effects_1.HealEffect(player, playerActive, 40));
            player.supporter.moveCardTo(this, player.discard);
        }
        return state;
    }
}
exports.SpicySeasonedCurry = SpicySeasonedCurry;
