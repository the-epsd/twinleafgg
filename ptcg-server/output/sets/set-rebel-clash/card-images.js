"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeedLightningEnergyArt = exports.ScoopUpNetArt = exports.CoalossalArt = void 0;
const coalossal_1 = require("./coalossal");
const scoop_up_net_1 = require("./scoop-up-net");
const speed_lightning_energy_1 = require("./speed-lightning-energy");
class CoalossalArt extends coalossal_1.Coalossal {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/RCL/RCL_107_R_EN_LG.png';
    }
}
exports.CoalossalArt = CoalossalArt;
class ScoopUpNetArt extends scoop_up_net_1.ScoopUpNet {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/RCL/RCL_165_R_EN_LG.png';
    }
}
exports.ScoopUpNetArt = ScoopUpNetArt;
class SpeedLightningEnergyArt extends speed_lightning_energy_1.SpeedLightningEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/RCL/RCL_173_R_EN_LG.png';
    }
}
exports.SpeedLightningEnergyArt = SpeedLightningEnergyArt;
