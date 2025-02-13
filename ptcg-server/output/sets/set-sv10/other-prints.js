"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyRecyclerSV10 = void 0;
const energy_recycler_1 = require("../set-battle-styles/energy-recycler");
class EnergyRecyclerSV10 extends energy_recycler_1.EnergyRecycler {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.fullName = 'Energy Recycler SV10';
        this.set = 'SV10';
        this.setNumber = '8';
    }
}
exports.EnergyRecyclerSV10 = EnergyRecyclerSV10;
