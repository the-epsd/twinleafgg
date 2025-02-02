"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HopsChoiceBand = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class HopsChoiceBand extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.tags = [card_types_1.CardTag.HOPS];
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.regulationMark = 'I';
        this.name = 'Hop\'s Choice Band';
        this.fullName = 'Hop\'s Choice Band SV9';
        this.text = 'When the Hop\'s Pokémon this card is attached to uses an attack, that attack costs 1 [C] Energy less and does 30 more damage to your opponent’s Active Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.player.active.cards.includes(this)) {
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            // No cost to reduce
            if (index === -1) {
                return state;
            }
            const hopsPokemon = effect.player.active.getPokemonCard();
            if (hopsPokemon && hopsPokemon.tags.includes(card_types_1.CardTag.HOPS)) {
                effect.cost.splice(index, 1);
            }
            return state;
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            const sourceCard = effect.source.getPokemonCard();
            if (sourceCard && sourceCard.tags.includes(card_types_1.CardTag.HOPS)) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.HopsChoiceBand = HopsChoiceBand;
