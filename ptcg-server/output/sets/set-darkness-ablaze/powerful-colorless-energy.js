"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerfulColorlessEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class PowerfulColorlessEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'DAA';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '176';
        this.name = 'Powerful Colorless Energy';
        this.fullName = 'Powerful Colorless Energy DAA';
        this.text = 'As long as this card is attached to a Pokémon, it provides [C] Energy.' +
            '' +
            'The attacks of the [C] Pokémon this card is attached to do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (effect.damage > 0 && effect.target === opponent.active) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.PowerfulColorlessEnergy = PowerfulColorlessEnergy;
