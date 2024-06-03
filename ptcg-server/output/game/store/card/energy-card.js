"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyCard = void 0;
const card_1 = require("./card");
const card_types_1 = require("./card-types");
class EnergyCard extends card_1.Card {
    constructor() {
        super(...arguments);
        this.superType = card_types_1.SuperType.ENERGY;
        this.energyType = card_types_1.EnergyType.BASIC;
        this.format = card_types_1.Format.NONE;
        this.provides = [];
        this.text = '';
        this.isBlocked = false;
    }
}
exports.EnergyCard = EnergyCard;
