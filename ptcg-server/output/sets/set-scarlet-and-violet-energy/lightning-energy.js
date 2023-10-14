"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightningEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class LightningEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.LIGHTNING];
        this.set = 'SVE';
        this.set2 = 'smpromo';
        this.setNumber = '131';
        this.name = 'Lightning Energy';
        this.fullName = 'Lightning Energy SVE';
    }
}
exports.LightningEnergy = LightningEnergy;
