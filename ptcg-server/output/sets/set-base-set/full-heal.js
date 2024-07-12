"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullHeal = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class FullHeal extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS'; // Replace with the appropriate set abbreviation
        this.name = 'Full Heal';
        this.fullName = 'Full Heal BS'; // Replace with the appropriate set abbreviation
        this.cardImage = 'assets/cardback.png'; // Replace with the appropriate card image path
        this.setNumber = '82'; // Replace with the appropriate set number
        this.text = 'Your Active Pokémon is no longer Asleep, Confused, Paralyzed, or Poisoned.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.active.specialConditions.length === 0) {
                throw new game_1.GameError(game_1.GameStoreMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.active.specialConditions = [];
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.FullHeal = FullHeal;
