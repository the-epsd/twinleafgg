"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeutralCenter = void 0;
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class NeutralCenter extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.regulationMark = 'H';
        this.name = 'Neutralization Zone';
        this.fullName = 'Neutral Center SFA';
        this.text = 'Pokémon that don\'t have a Rule Box don\'t take any damage from attacks from their opponent\'s Pokémon ex and Pokémon V.' +
            '' +
            'If this card is in your discard pile, it can\'t be put into your hand or put back into your deck.';
    }
    reduceEffect(store, state, effect) {
        // Prevent damage from Pokemon V and ex
        if (effect instanceof attack_effects_1.PutDamageEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // Do not ignore self-damage from Pokemon-Ex
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
            const opponent = state_utils_1.StateUtils.findOwner(state, effect.source);
            if (player === opponent) {
                return state;
            }
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const nonRuleBox = pokemonCard && !pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_ex) && !pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_V) && !pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_VMAX) && !pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_VSTAR);
            if (sourceCard && sourceCard.tags.includes(card_types_1.CardTag.POKEMON_V)) {
                if (nonRuleBox) {
                    effect.preventDefault = true;
                }
                else {
                    effect.preventDefault = false;
                }
            }
            if (sourceCard && sourceCard.tags.includes(card_types_1.CardTag.POKEMON_VSTAR)) {
                if (nonRuleBox) {
                    effect.preventDefault = true;
                }
            }
            else {
                effect.preventDefault = false;
            }
            if (sourceCard && sourceCard.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                if (nonRuleBox) {
                    effect.preventDefault = true;
                }
                else {
                    effect.preventDefault = false;
                }
            }
            if (sourceCard && sourceCard.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                if (nonRuleBox) {
                    effect.preventDefault = true;
                }
                else {
                    effect.preventDefault = false;
                }
            }
            if (sourceCard && sourceCard.tags.includes(card_types_1.CardTag.RADIANT)) {
                if (nonRuleBox) {
                    effect.preventDefault = true;
                }
                else {
                    effect.preventDefault = false;
                }
            }
            if (sourceCard && sourceCard.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                if (nonRuleBox) {
                    effect.preventDefault = true;
                }
                else {
                    effect.preventDefault = false;
                }
            }
            if (sourceCard && sourceCard.tags.includes(card_types_1.CardTag.POKEMON_GX)) {
                if (nonRuleBox) {
                    effect.preventDefault = true;
                }
                else {
                    effect.preventDefault = false;
                }
            }
            if (sourceCard && sourceCard.tags.includes(card_types_1.CardTag.POKEMON_LV_X)) {
                if (nonRuleBox) {
                    effect.preventDefault = true;
                }
                else {
                    effect.preventDefault = false;
                }
            }
            return state;
        }
        return state;
    }
}
exports.NeutralCenter = NeutralCenter;
