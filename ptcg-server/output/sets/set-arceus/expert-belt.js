"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpertBelt = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class ExpertBelt extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'AR';
        this.name = 'Expert Belt';
        this.fullName = 'Expert Belt AR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
        this.text = 'The Pokemon this card is attached to gets +20 HP and that Pokemon\'s ' +
            'attacks do 20 more damage to your opponent\'s Active Pokemon (before ' +
            'applying Weakness and Resistance). When the Pokemon this card is ' +
            'attached to is Knocked Out, your opponent takes 1 more Prize card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            effect.hp += 20;
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (effect.damage > 0 && effect.target === opponent.active) {
                effect.damage += 20;
            }
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            effect.prizeCount += 1;
        }
        return state;
    }
}
exports.ExpertBelt = ExpertBelt;
