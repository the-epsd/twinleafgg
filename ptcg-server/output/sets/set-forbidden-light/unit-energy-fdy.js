"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitEnergyFDY = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class UnitEnergyFDY extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.name = 'Unit Energy FDY';
        this.fullName = 'Unit Energy FDY FLI';
        this.text = 'This card provides [C] Energy.' +
            '' +
            'While this card is attached to a Pokémon, it provides [F], [D], and [Y] Energy but provides only 1 Energy at a time.';
        this.blendedEnergies = [card_types_1.CardType.FIGHTING, card_types_1.CardType.DARK, card_types_1.CardType.FAIRY];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(effect.player, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_a) {
                return state;
            }
            // Find the first energy type that's not already provided by other energies
            const neededType = this.blendedEnergies.find(type => !effect.energyMap.some(energy => energy.provides.includes(type)));
            if (neededType) {
                // Only provide the specific energy type that's needed
                effect.energyMap.push({
                    card: this,
                    provides: [neededType]
                });
            }
        }
        return state;
    }
}
exports.UnitEnergyFDY = UnitEnergyFDY;
