"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatStone = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
class FloatStone extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'PLF';
        this.name = 'Float Stone';
        this.fullName = 'Float Stone PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.text = 'The Pokemon this card is attached to has no Retreat Cost.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.tool === this) {
            effect.cost = [];
        }
        return state;
    }
}
exports.FloatStone = FloatStone;
