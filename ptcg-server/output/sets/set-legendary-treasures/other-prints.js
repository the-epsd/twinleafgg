"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergySwitchLTR = void 0;
const energy_switch_1 = require("../set-scarlet-and-violet/energy-switch");
class EnergySwitchLTR extends energy_switch_1.EnergySwitch {
    constructor() {
        super(...arguments);
        this.setNumber = '112';
        this.fullName = 'Energy Switch LTR';
        this.set = 'LTR';
    }
}
exports.EnergySwitchLTR = EnergySwitchLTR;
