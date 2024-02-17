"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleColorlessEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class DoubleColorlessEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'XY';
        this.name = 'Double Colorless Energy';
        this.fullName = 'Double Colorless Energy XY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '130';
    }
}
exports.DoubleColorlessEnergy = DoubleColorlessEnergy;
