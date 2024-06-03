"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoomerangEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class BoomerangEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '166';
        this.regulationMark = 'H';
        this.name = 'Boomerang Energy';
        this.fullName = 'Boomerang Energy TWM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DiscardCardsEffect && effect.target === this.cards) {
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.BoomerangEnergy = BoomerangEnergy;
