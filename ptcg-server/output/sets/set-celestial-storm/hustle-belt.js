"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HustleBelt = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
class HustleBelt extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'CES';
        this.name = 'Hustle Belt';
        this.fullName = 'Hustle Belt CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '134';
        this.text = 'If the Pokémon this card is attached to has 30 HP or less remaining and has any damage counters on it, its attacks do 60 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (effect.damage > 0 && effect.target === opponent.active && effect.source.damage !== 0 && effect.source.hp - effect.source.damage <= 30) {
                effect.damage += 60;
            }
        }
        return state;
    }
}
exports.HustleBelt = HustleBelt;
