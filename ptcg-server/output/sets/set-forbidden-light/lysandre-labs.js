"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LysandreLabs = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
class LysandreLabs extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '111';
        this.name = 'Lysandre Labs';
        this.fullName = 'Lysandre Labs FLI';
        this.text = ' Pokémon Tool cards in play (both yours and your opponent\'s) have no effect.';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.LysandreLabs = LysandreLabs;
