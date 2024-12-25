"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutureBoosterEnergyCapsuleTEF = exports.AncientBoosterEnergyCapsuleTEF = void 0;
const ancient_booster_energy_capsule_1 = require("../set-paradox-rift/ancient-booster-energy-capsule");
const future_booster_energy_capsule_1 = require("../set-paradox-rift/future-booster-energy-capsule");
class AncientBoosterEnergyCapsuleTEF extends ancient_booster_energy_capsule_1.AncientBoosterEnergyCapsule {
    constructor() {
        super(...arguments);
        this.fullName = 'Ancient Booster Energy Capsule TEF';
        this.set = 'TEF';
        this.setNumber = '140';
    }
}
exports.AncientBoosterEnergyCapsuleTEF = AncientBoosterEnergyCapsuleTEF;
class FutureBoosterEnergyCapsuleTEF extends future_booster_energy_capsule_1.FutureBoosterEnergyCapsule {
    constructor() {
        super(...arguments);
        this.fullName = 'Future Booster Energy Capsule TEF';
        this.set = 'TEF';
        this.setNumber = '149';
    }
}
exports.FutureBoosterEnergyCapsuleTEF = FutureBoosterEnergyCapsuleTEF;
