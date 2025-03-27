"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class ReactEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'LM';
        this.name = 'React Energy';
        this.fullName = 'React Energy LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.text = 'React Energy provides [C] Energy.';
    }
}
exports.ReactEnergy = ReactEnergy;
