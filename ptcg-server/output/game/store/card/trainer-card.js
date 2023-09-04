"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerCard = void 0;
const card_1 = require("./card");
const card_types_1 = require("./card-types");
class TrainerCard extends card_1.Card {
    constructor() {
        super(...arguments);
        this.superType = card_types_1.SuperType.TRAINER;
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.format = [];
        this.text = '';
    }
}
exports.TrainerCard = TrainerCard;
