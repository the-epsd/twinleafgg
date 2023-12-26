"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuminousEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
class LuminousEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'PAL';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '191';
        this.name = 'Luminous Energy';
        this.fullName = 'Luminous Energy PAL';
        this.text = 'As long as this card is attached to a Pokémon, it provides every type of Energy but provides only 1 Energy at a time.' +
            '' +
            'If the Pokémon this card is attached to has any other Special Energy attached, this card provides [C] Energy instead.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const attachedTo = effect.source;
            const otherSpecialEnergy = attachedTo.cards.some(card => {
                return card instanceof energy_card_1.EnergyCard
                    && card.energyType === card_types_1.EnergyType.SPECIAL
                    && card !== this;
            });
            if (otherSpecialEnergy) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.COLORLESS] });
            }
            else {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY] });
            }
            return state;
        }
        return state;
    }
}
exports.LuminousEnergy = LuminousEnergy;
