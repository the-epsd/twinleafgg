"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrassEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class GrassEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.GRASS];
        this.set = 'DP';
        this.name = 'Grass Energy';
        this.fullName = 'Grass Energy EVO';
    }
}
exports.GrassEnergy = GrassEnergy;
