"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingCourtArt = exports.SpeedLightningEnergyArt = exports.ScoopUpNetArt = exports.CoalossalArt = exports.CapaciousBucketArt = void 0;
const capacious_bucket_1 = require("./capacious-bucket");
const coalossal_1 = require("./coalossal");
const scoop_up_net_1 = require("./scoop-up-net");
const speed_lightning_energy_1 = require("./speed-lightning-energy");
const training_court_1 = require("./training-court");
class CapaciousBucketArt extends capacious_bucket_1.CapaciousBucket {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/RCL/RCL_156_R_EN_LG.png';
    }
}
exports.CapaciousBucketArt = CapaciousBucketArt;
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
class TrainingCourtArt extends training_court_1.TrainingCourt {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/RCL/RCL_169_R_EN_LG.png';
    }
}
exports.TrainingCourtArt = TrainingCourtArt;
