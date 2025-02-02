"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VileplumeArt = exports.UnownArt = exports.HexManiacArt = exports.EcoArmArt = void 0;
const vileplume_1 = require("./vileplume");
const eco_arm_1 = require("./eco-arm");
const hex_maniac_1 = require("./hex-maniac");
const unown_1 = require("./unown");
class EcoArmArt extends eco_arm_1.EcoArm {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/AOR/AOR_071_R_EN_LG.png';
    }
}
exports.EcoArmArt = EcoArmArt;
class HexManiacArt extends hex_maniac_1.HexManiac {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/AOR/AOR_075_R_EN_LG.png';
    }
}
exports.HexManiacArt = HexManiacArt;
class UnownArt extends unown_1.Unown {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/AOR/AOR_030_R_EN.png';
    }
}
exports.UnownArt = UnownArt;
class VileplumeArt extends vileplume_1.Vileplume {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/AOR/AOR_003_R_EN_LG.png';
    }
}
exports.VileplumeArt = VileplumeArt;
