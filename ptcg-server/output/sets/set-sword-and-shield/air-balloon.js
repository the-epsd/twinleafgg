"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirBalloon = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
class AirBalloon extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '156';
        this.name = 'Air Balloon';
        this.fullName = 'Air Balloon SSH';
        this.text = 'The Retreat Cost of the Pokémon this card is attached to is [C][C] less.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.tool === this) {
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            if (index !== -1) {
                effect.cost.splice(index, 2);
            }
            return state;
        }
        return state;
    }
}
exports.AirBalloon = AirBalloon;
