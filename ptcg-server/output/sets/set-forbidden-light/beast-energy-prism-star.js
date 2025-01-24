"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeastEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
class BeastEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.provides = [];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'FLI';
        this.setNumber = '117';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Beast Energy';
        this.fullName = 'Beast Energy FLI';
        this.text = 'This card provides [C] Energy. \n While this card is attached to an Ultra Beast, it provides every type of Energy but provides only 1 Energy at a time. The attacks of the Ultra Beast this card is attached to do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        var _a, _b, _c;
        // Provide energy when attached to Ultra Beast Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            if ((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.ULTRA_BEAST)) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY] });
            }
            // slapping the default (this provides colorless) when not on an ultra beast
            if (!((_b = effect.source.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.ULTRA_BEAST))) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.COLORLESS] });
            }
            return state;
        }
        // do the additional damage
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (effect.target !== opponent.active) {
                return state;
            }
            if (!((_c = effect.source.getPokemonCard()) === null || _c === void 0 ? void 0 : _c.tags.includes(card_types_1.CardTag.ULTRA_BEAST))) {
                return state;
            }
            effect.damage += 30;
        }
        return state;
    }
}
exports.BeastEnergy = BeastEnergy;
