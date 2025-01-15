"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class MistEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '161';
        this.name = 'Mist Energy';
        this.fullName = 'Mist Energy TEF';
        this.text = 'As long as this card is attached to a Pokémon, it provides C Energy.' +
            '' +
            'Prevent all effects of attacks from your opponent\'s Pokémon done to the Pokémon this card is attached to. (Existing effects are not removed. Damage is not an effect.)';
    }
    reduceEffect(store, state, effect) {
        // Prevent effects of attacks
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const sourceCard = effect.source.getPokemonCard();
            if (sourceCard) {
                // Allow Weakness & Resistance
                if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
                    return state;
                }
                // Allow damage
                if (effect instanceof attack_effects_1.PutDamageEffect) {
                    return state;
                }
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.MistEnergy = MistEnergy;
