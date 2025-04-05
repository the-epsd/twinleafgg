"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlendEnergyWLFM = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BlendEnergyWLFM extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.name = 'Blend Energy WLFM';
        this.fullName = 'Blend Energy WLFM DRX';
        this.text = 'This card provides [C] Energy. When attached to a Pokémon, this card provides [W], [L], [F], or [M] but only 1 Energy at a time.';
        this.blendedEnergies = [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING, card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            try {
                // Always add the base "EnergyEffect"
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
exports.BlendEnergyWLFM = BlendEnergyWLFM;
