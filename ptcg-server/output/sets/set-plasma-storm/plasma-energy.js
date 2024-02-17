"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlasmaEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class PlasmaEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'PLS';
        this.name = 'Plasma Energy';
        this.fullName = 'Plasma Energy PLS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '127';
        this.text = 'This card provides C Energy.';
    }
}
exports.PlasmaEnergy = PlasmaEnergy;
