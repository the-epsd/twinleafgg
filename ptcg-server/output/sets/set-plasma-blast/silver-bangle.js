"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SilverBangle = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class SilverBangle extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'PLB';
        this.name = 'Silver Bangle';
        this.fullName = 'Silver Bangle PLB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.text = 'The attacks of the Pokemon this card is attached to (excluding ' +
            'Pokemon-EX) do 30 more damage to Active Pokemon-EX (before applying ' +
            'Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            const pokemonCard = effect.source.getPokemonCard();
            if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                return state;
            }
            const targetCard = effect.target.getPokemonCard();
            if (targetCard && targetCard.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.SilverBangle = SilverBangle;
