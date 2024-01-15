"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Caitlin = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
class Caitlin extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '132';
        this.name = 'Caitlin';
        this.fullName = 'Caitlin EVS';
        this.text = 'Put as many cards from your hand as you like on the bottom of your deck in any order. Then, draw a card for each card you put on the bottom of your deck.';
    }
}
exports.Caitlin = Caitlin;
