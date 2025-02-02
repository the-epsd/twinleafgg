"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaximumBelt = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class MaximumBelt extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '154';
        this.regulationMark = 'H';
        this.name = 'Maximum Belt';
        this.fullName = 'Maximum Belt TEF';
        this.text = 'The attacks of the Pokémon this card is attached to do 50 more damage to your opponent\'s Active Pokémon ex.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            const targetCard = effect.target.getPokemonCard();
            if (targetCard && targetCard.tags.includes(card_types_1.CardTag.POKEMON_ex) && effect.damage > 0) {
                effect.damage += 50;
            }
        }
        return state;
    }
}
exports.MaximumBelt = MaximumBelt;
