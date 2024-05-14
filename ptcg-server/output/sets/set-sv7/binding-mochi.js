"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BindingMochi = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class BindingMochi extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
        this.regulationMark = 'H';
        this.name = 'Binding Mochi';
        this.fullName = 'Binding Mochi SV6a';
        this.text = ' If the Pokémon this card is attached to is Poisoned, its attacks deal 40 more damage to your opponent\'s Active Pokémon..';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            if (player.active.specialConditions.includes(card_types_1.SpecialCondition.POISONED)) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.BindingMochi = BindingMochi;
