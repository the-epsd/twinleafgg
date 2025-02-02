"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WashWaterEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class WashWaterEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'VIV';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '165';
        this.name = 'Wash Water Energy';
        this.fullName = 'Wash Water Energy VIV';
        this.text = 'As long as this card is attached to a Pokémon, it provides [W] Energy.' +
            '' +
            'Prevent all effects of attacks from your opponent\'s Pokémon done to the [W] Pokémon this card is attached to. (Existing effects are not removed. Damage is not an effect.)';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.WATER] });
            return state;
        }
        // Prevent effects of attacks
        if (effect instanceof attack_effects_1.AbstractAttackEffect && ((_b = (_a = effect.target) === null || _a === void 0 ? void 0 : _a.cards) === null || _b === void 0 ? void 0 : _b.includes(this))) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.WATER)) {
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
exports.WashWaterEnergy = WashWaterEnergy;
