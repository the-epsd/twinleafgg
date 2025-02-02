"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
class PrismEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'NXD';
        this.name = 'Prism Energy';
        this.fullName = 'Prism Energy NXD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.text = 'This card provides C Energy. If the Pokemon this card is attached to is ' +
            'a Basic Pokemon, this card provides every type of Energy but provides ' +
            'only 1 Energy at a time.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect
            && effect.source.cards.includes(this)
            && effect.source.isBasic()) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY] });
        }
        return state;
    }
}
exports.PrismEnergy = PrismEnergy;
