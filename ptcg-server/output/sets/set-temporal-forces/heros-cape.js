"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HerosCape = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
class HerosCape extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '152';
        this.name = 'Hero\'s Cape';
        this.fullName = 'Hero\'s Cape TEF';
        this.text = 'The Pokémon this card is attached to gets +100 HP.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            effect.hp += 100;
        }
        return state;
    }
}
exports.HerosCape = HerosCape;
