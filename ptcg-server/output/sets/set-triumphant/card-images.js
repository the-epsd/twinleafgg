"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwinsArt = exports.SeekerArt = exports.RescueEnergyArt = exports.JunkArmArt = exports.CelebiArt = exports.BlackBeltArt = exports.AlphLithographArt = void 0;
const alph_lithograph_1 = require("./alph-lithograph");
const black_belt_1 = require("./black-belt");
const celebi_1 = require("./celebi");
const junk_arm_1 = require("./junk-arm");
const rescue_energy_1 = require("./rescue-energy");
const seeker_1 = require("./seeker");
const twins_1 = require("./twins");
class AlphLithographArt extends alph_lithograph_1.AlphLithograph {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TM/TM_FOUR_R_EN.png';
    }
}
exports.AlphLithographArt = AlphLithographArt;
class BlackBeltArt extends black_belt_1.BlackBelt {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TM/TM_085_R_EN_LG.png';
    }
}
exports.BlackBeltArt = BlackBeltArt;
class CelebiArt extends celebi_1.Celebi {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TM/TM_092_R_EN_LG.png';
    }
}
exports.CelebiArt = CelebiArt;
class JunkArmArt extends junk_arm_1.JunkArm {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TM/TM_087_R_EN_LG.png';
    }
}
exports.JunkArmArt = JunkArmArt;
class RescueEnergyArt extends rescue_energy_1.RescueEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TM/TM_090_R_EN_LG.png';
    }
}
exports.RescueEnergyArt = RescueEnergyArt;
class SeekerArt extends seeker_1.Seeker {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TM/TM_088_R_EN_LG.png';
    }
}
exports.SeekerArt = SeekerArt;
class TwinsArt extends twins_1.Twins {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TM/TM_089_R_EN_LG.png';
    }
}
exports.TwinsArt = TwinsArt;
