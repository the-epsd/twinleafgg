"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuscleBand = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
class MuscleBand extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'XY';
        this.name = 'Muscle Band';
        this.fullName = 'Muscle Band XY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '121';
        this.text = 'The attacks of the Pokemon this card is attached to do 20 more ' +
            'damage to our opponent\'s Active Pokemon (before aplying Weakness ' +
            'and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.source.cards.includes(this)) {
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (effect.damage > 0 && effect.target === opponent.active) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.MuscleBand = MuscleBand;
