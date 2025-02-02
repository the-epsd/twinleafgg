"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarknessEnergySpecial = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
class DarknessEnergySpecial extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.DARK];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'HS';
        this.name = 'Darkness Energy (Special)';
        this.fullName = 'Darkness Energy (Special) HGSS';
        this.text = 'If the Pokemon Darkness Energy is attached to attacks, ' +
            'the attack does 10 more damage to the Active Pokemon (before applying ' +
            'Weakness and Resistance). Ignore this effect if the Pokemon that ' +
            'Darkness Energy is attached to isn\'t D. Darkness Energy provides ' +
            'D Energy. (Doesn\'t count as a basic Energy card.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            if (effect.source.cards.includes(this)) {
                const player = effect.player;
                const opponent = state_utils_1.StateUtils.getOpponent(state, player);
                if (effect.target !== opponent.active) {
                    return state;
                }
                const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
                store.reduceEffect(state, checkPokemonType);
                if (checkPokemonType.cardTypes.includes(card_types_1.CardType.DARK)) {
                    effect.damage += 10;
                }
            }
        }
        return state;
    }
}
exports.DarknessEnergySpecial = DarknessEnergySpecial;
