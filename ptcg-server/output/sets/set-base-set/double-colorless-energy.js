"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleColorlessEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
class DoubleColorlessEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Double Colorless Energy';
        this.fullName = 'Double Colorless Energy BS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            this.provides = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        }
        return state;
    }
}
exports.DoubleColorlessEnergy = DoubleColorlessEnergy;
