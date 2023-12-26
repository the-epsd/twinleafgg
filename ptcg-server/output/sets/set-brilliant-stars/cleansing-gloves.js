"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleansingGloves = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class CleansingGloves extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'F';
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '136';
        this.name = 'Cleansing Gloves';
        this.fullName = 'Cleansing Gloves BRS';
        this.text = 'The attacks of the Pokémon this card is attached to do 30 more damage to your opponent\'s Active P Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            const targetCard = effect.target.getPokemonCard();
            if (targetCard && targetCard.cardType === card_types_1.CardType.PSYCHIC) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.CleansingGloves = CleansingGloves;
