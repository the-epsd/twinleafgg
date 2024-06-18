"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeedLightningEnergyArt = exports.CoalossalArt = void 0;
const coalossal_1 = require("./coalossal");
const speed_lightning_energy_1 = require("./speed-lightning-energy");
class CoalossalArt extends coalossal_1.Coalossal {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/RCL/RCL_107_R_EN_LG.png';
    }
}
exports.CoalossalArt = CoalossalArt;
class SpeedLightningEnergyArt extends speed_lightning_energy_1.SpeedLightningEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/RCL/RCL_173_R_EN_LG.png';
    }
}
exports.SpeedLightningEnergyArt = SpeedLightningEnergyArt;
