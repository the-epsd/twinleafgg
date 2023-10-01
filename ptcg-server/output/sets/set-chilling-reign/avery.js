"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avery = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
//Avery is not done yet!! have to add the "remove from bench" logic
class Avery extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CRE';
        this.regulationMark = 'E';
        this.name = 'Avery';
        this.fullName = 'Avery CRE';
        this.text = 'Draw 3 cards. If you drew any cards in this way, your opponent discards Pokémon from their Bench until they have 3.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Draw 3 cards
            player.deck.moveTo(player.hand, 3);
            // Get opponent
            // Opponent discards cards if more than 3 bench Pokemon
            // Prompt to choose bench
            // Remove last Pokemon from bench
            // Prompt opponent to discard Pokemon
        }
        return state;
    }
}
exports.Avery = Avery;
