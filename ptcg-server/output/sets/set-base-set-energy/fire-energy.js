"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class FireEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FIRE];
        this.set = 'BS';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '98';
        this.name = 'Fire Energy';
        this.fullName = 'Fire Energy BS';
    }
}
exports.FireEnergy = FireEnergy;
