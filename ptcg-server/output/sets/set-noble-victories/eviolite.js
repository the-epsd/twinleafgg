"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eviolite = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Eviolite extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'NVI';
        this.name = 'Eviolite';
        this.fullName = 'Eviolite NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.text = 'If the Pokemon this card is attached to is a Basic Pokemon, ' +
            'any damage done to this Pokemon by attacks is reduced by 20 ' +
            '(after applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            if (effect.target.tool === this && effect.target.isBasic()) {
                effect.damage -= 20;
            }
        }
        return state;
    }
}
exports.Eviolite = Eviolite;
