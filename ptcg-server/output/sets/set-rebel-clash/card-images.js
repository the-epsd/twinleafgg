"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwinEnergyArt = exports.TrainingCourtArt = exports.SpeedLightningEnergyArt = exports.ScoopUpNetArt = exports.HorrorPsychicEnergyArt = exports.CoalossalArt = exports.CaptureEnergyArt = exports.CapaciousBucketArt = void 0;
const capacious_bucket_1 = require("./capacious-bucket");
const capture_energy_1 = require("./capture-energy");
const coalossal_1 = require("./coalossal");
const horror_psychic_energy_1 = require("./horror-psychic-energy");
const scoop_up_net_1 = require("./scoop-up-net");
const speed_lightning_energy_1 = require("./speed-lightning-energy");
const training_court_1 = require("./training-court");
const twin_energy_1 = require("./twin-energy");
class CapaciousBucketArt extends capacious_bucket_1.CapaciousBucket {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/RCL/RCL_156_R_EN_LG.png';
    }
}
exports.CapaciousBucketArt = CapaciousBucketArt;
class CaptureEnergyArt extends capture_energy_1.CaptureEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/RCL/RCL_171_R_EN_LG.png';
    }
}
exports.CaptureEnergyArt = CaptureEnergyArt;
class CoalossalArt extends coalossal_1.Coalossal {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/RCL/RCL_107_R_EN_LG.png';
    }
}
exports.CoalossalArt = CoalossalArt;
class HorrorPsychicEnergyArt extends horror_psychic_energy_1.HorrorPsychicEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/RCL/RCL_172_R_EN.png';
    }
}
exports.HorrorPsychicEnergyArt = HorrorPsychicEnergyArt;
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
class TwinEnergyArt extends twin_energy_1.TwinEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/RCL/RCL_174_R_EN.png';
    }
}
exports.TwinEnergyArt = TwinEnergyArt;
