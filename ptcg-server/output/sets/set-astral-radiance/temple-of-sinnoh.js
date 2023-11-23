"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempleofSinnoh = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class TempleofSinnoh extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.set2 = 'astralradiance';
        this.setNumber = '155';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'ASR';
        this.name = 'Temple of Sinnoh';
        this.fullName = 'All Special Energy attached to Pokémon (both yours and your opponent\'s) provide C Energy and have no other effect.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_1.EnergyCard && game_1.StateUtils.getStadiumCard(state) === this) {
            effect.energyMap.forEach(({ card, provides }) => {
                if (card.superType === card_types_1.SuperType.ENERGY) {
                    if (card_types_1.EnergyType.SPECIAL)
                        provides = [card_types_1.CardType.COLORLESS];
                    effect.preventDefault = true;
                    return state;
                }
            });
        }
        return state;
    }
}
exports.TempleofSinnoh = TempleofSinnoh;
