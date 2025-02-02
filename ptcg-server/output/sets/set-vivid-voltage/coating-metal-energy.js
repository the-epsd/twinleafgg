"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoatingMetalEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class CoatingMetalEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'VIV';
        this.name = 'Coating Metal Energy';
        this.fullName = 'Coating Metal Energy VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '163';
        this.text = 'As long as this card is attached to a Pokémon, it provides [M] Energy.' +
            '' +
            'The [M] Pokémon this card is attached to has no Weakness.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.METAL] });
            return state;
        }
        // Prevent effects of attacks
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target && effect.target.cards.includes(this)) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.METAL)) {
                // Allow damage
                if (effect instanceof attack_effects_1.PutDamageEffect) {
                    effect.attackEffect.ignoreWeakness = true;
                    return state;
                }
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    effect.attackEffect.ignoreWeakness = true;
                    return state;
                }
            }
        }
        return state;
    }
}
exports.CoatingMetalEnergy = CoatingMetalEnergy;
