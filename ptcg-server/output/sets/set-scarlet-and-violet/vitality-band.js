"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VitalityBand = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class VitalityBand extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '197';
        this.regulationMark = 'G';
        this.name = 'Vitality Band';
        this.fullName = 'Vitality Band SVI';
        this.text = 'The attacks of the Pokémon this card is attached to do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            effect.damage += 10;
        }
        return state;
    }
}
exports.VitalityBand = VitalityBand;
