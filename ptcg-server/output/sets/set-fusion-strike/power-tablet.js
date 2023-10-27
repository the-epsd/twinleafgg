"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerTablet = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class PowerTablet extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'FST';
        this.tags = [card_types_1.CardTag.FUSION_STRIKE];
        this.set2 = 'fusionstrike';
        this.setNumber = '236';
        this.regulationMark = 'E';
        this.name = 'Power Tablet';
        this.fullName = 'Power Tablet FST';
        this.text = 'During this turn, your Fusion Strike Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            const pokemonCard = effect.source.getPokemonCard();
            if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.FUSION_STRIKE)) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.PowerTablet = PowerTablet;
