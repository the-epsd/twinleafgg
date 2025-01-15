"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BraveyCharm = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
class BraveyCharm extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '173';
        this.name = 'Bravery Charm';
        this.fullName = 'Bravery Charm PAL';
        this.text = 'The Basic Pokémon this card is attached to gets +50 HP.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            const card = effect.target.getPokemonCard();
            if (card === undefined) {
                return state;
            }
            if (card.stage === card_types_1.Stage.BASIC) {
                effect.hp += 50;
            }
        }
        return state;
    }
}
exports.BraveyCharm = BraveyCharm;
