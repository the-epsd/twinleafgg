"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StealthyHood = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class StealthyHood extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.name = 'Stealthy Hood';
        this.fullName = 'Stealthy Hood UNB';
        this.set = 'UNB';
        this.setNumber = '186';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // If this is an ability effect from the opponent
        if (effect instanceof game_effects_1.EffectOfAbilityEffect && effect.target && effect.target.cards.includes(this)) {
            effect.target = undefined;
        }
        return state;
    }
}
exports.StealthyHood = StealthyHood;
