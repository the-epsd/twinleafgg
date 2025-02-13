"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SilverMirror = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class SilverMirror extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'PLB';
        this.name = 'Silver Mirror';
        this.fullName = 'Silver Mirror PLB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
        this.text = 'Prevent all effects of attacks, including damage, done to the Pokémon this card ' +
            'is attached to (excluding Pokémon-EX) by your opponent\'s Team Plasma Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const sourceCard = effect.source.getPokemonCard();
            if (sourceCard.tags.includes(card_types_1.CardTag.TEAM_PLASMA)) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.SilverMirror = SilverMirror;
