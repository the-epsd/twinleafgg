"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BraveyCharm = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class BraveyCharm extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.set2 = 'paldeaevolved';
        this.setNumber = '173';
        this.name = 'Bravery Charm';
        this.fullName = 'Bravery Charm PAL';
        this.text = 'The Basic Pokémon this card is attached to gets +50 HP.';
    }
    reduceEffect(store, state, effect) {
        if (this instanceof game_1.PokemonCard && this.stage === card_types_1.Stage.BASIC) {
            if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
                effect.hp += 50;
            }
            return state;
        }
        return state;
    }
}
exports.BraveyCharm = BraveyCharm;
