"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LakeAcuity = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class LakeAcuity extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'F';
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '160';
        this.name = 'Lake Acuity';
        this.fullName = 'Lake Acuity LOR';
        this.text = 'All Pokémon that have any [W] or [F] Energy attached (both yours and your opponent\'s) take 20 less damage from attacks from the opponent\'s Pokémon (after applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const pokemon = effect.target;
            const waterFightingEnergies = pokemon.cards.filter(card => card instanceof game_1.EnergyCard && (card.provides.includes(card_types_1.CardType.WATER) || card.provides.includes(card_types_1.CardType.FIGHTING)));
            if (waterFightingEnergies.length > 0) {
                effect.damage -= 20;
            }
        }
        return state;
    }
}
exports.LakeAcuity = LakeAcuity;
