"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerCard = void 0;
const game_effects_1 = require("../effects/game-effects");
const card_1 = require("./card");
const card_types_1 = require("./card-types");
class TrainerCard extends card_1.Card {
    constructor() {
        super(...arguments);
        this.superType = card_types_1.SuperType.TRAINER;
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.format = card_types_1.Format.NONE;
        this.text = '';
        this.powers = [];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect) {
            for (let i = 0; i < this.powers.length; i++) {
                if (effect.power === this.powers[i] && effect.power.effect !== undefined) {
                    return effect.power.effect(store, state, effect);
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.TrainerCard = TrainerCard;
