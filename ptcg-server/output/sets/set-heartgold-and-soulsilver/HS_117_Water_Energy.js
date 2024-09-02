"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaterEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class WaterEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.WATER];
        this.set = 'HS';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '117';
        this.name = 'Water Energy';
        this.fullName = 'Water Energy HS';
    }
}
exports.WaterEnergy = WaterEnergy;
