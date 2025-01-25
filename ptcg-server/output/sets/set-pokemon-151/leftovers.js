"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leftovers = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Leftovers extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '163';
        this.name = 'Leftovers';
        this.fullName = 'Leftovers MEW';
        this.text = 'At the end of your turn, if the Pokémon this card is attached to is in the Active Spot, heal 20 damage from it.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.tool === this) {
            const player = effect.player;
            const healEffect = new game_effects_1.HealEffect(player, player.active, 20);
            store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Leftovers = Leftovers;
