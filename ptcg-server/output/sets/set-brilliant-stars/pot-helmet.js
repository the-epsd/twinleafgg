"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PotHelmet = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const state_1 = require("../../game/store/state/state");
class PotHelmet extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'F';
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '146';
        this.name = 'Pot Helmet';
        this.fullName = 'Pot Helmet BRS';
        this.text = 'If the Pokémon this card is attached to doesn\'t have a Rule Box, it takes 30 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance). (Pokémon V, Pokémon-GX, etc. have Rule Boxes.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const sourceCard = effect.target.getPokemonCard();
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            if (effect.damageReduced) {
                // Damage already reduced, don't reduce again
                return state;
            }
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
            if (sourceCard && sourceCard.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VMAX || card_types_1.CardTag.POKEMON_VSTAR || sourceCard.tags.includes(card_types_1.CardTag.POKEMON_ex || card_types_1.CardTag.RADIANT))) {
                return state;
            }
            // Check if damage target is owned by this card's owner 
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            if (targetPlayer === player) {
                effect.damage = Math.max(0, effect.damage - 30);
                effect.damageReduced = true;
            }
            return state;
        }
        return state;
    }
}
exports.PotHelmet = PotHelmet;
