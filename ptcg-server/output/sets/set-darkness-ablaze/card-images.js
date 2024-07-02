"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrsaringArt = exports.TeddiursaArt = exports.TapuKokoArt = exports.RoseTowerArt = exports.PowerfulColorlessEnergyArt = exports.LugiaArt = exports.KangaskhanArt = exports.HidingDarknessEnergyArt = exports.CapeOfToughnessArt = exports.BirdKeeperArt = void 0;
const bird_keeper_1 = require("./bird-keeper");
const cape_of_toughness_1 = require("./cape-of-toughness");
const hiding_darkness_energy_1 = require("./hiding-darkness-energy");
const kangaskhan_1 = require("./kangaskhan");
const lugia_1 = require("./lugia");
const powerful_colorless_energy_1 = require("./powerful-colorless-energy");
const rose_tower_1 = require("./rose-tower");
const tapu_koko_1 = require("./tapu-koko");
const teddiursa_1 = require("./teddiursa");
const ursaring_1 = require("./ursaring");
class BirdKeeperArt extends bird_keeper_1.BirdKeeper {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_159_R_EN_LG.png';
    }
}
exports.BirdKeeperArt = BirdKeeperArt;
class CapeOfToughnessArt extends cape_of_toughness_1.CapeOfToughness {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_160_R_EN_LG.png';
    }
}
exports.CapeOfToughnessArt = CapeOfToughnessArt;
class HidingDarknessEnergyArt extends hiding_darkness_energy_1.HidingDarknessEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_175_R_EN.png';
    }
}
exports.HidingDarknessEnergyArt = HidingDarknessEnergyArt;
class KangaskhanArt extends kangaskhan_1.Kangaskhan {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_133_R_EN_LG.png';
    }
}
exports.KangaskhanArt = KangaskhanArt;
class LugiaArt extends lugia_1.Lugia {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_140_R_EN_LG.png';
    }
}
exports.LugiaArt = LugiaArt;
class PowerfulColorlessEnergyArt extends powerful_colorless_energy_1.PowerfulColorlessEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_176_R_EN.png';
    }
}
exports.PowerfulColorlessEnergyArt = PowerfulColorlessEnergyArt;
class RoseTowerArt extends rose_tower_1.RoseTower {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_169_R_EN_LG.png';
    }
}
exports.RoseTowerArt = RoseTowerArt;
class TapuKokoArt extends tapu_koko_1.TapuKoko {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_061_R_EN_LG.png';
    }
}
exports.TapuKokoArt = TapuKokoArt;
class TeddiursaArt extends teddiursa_1.Teddiursa {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_138_R_EN.png';
    }
}
exports.TeddiursaArt = TeddiursaArt;
class UrsaringArt extends ursaring_1.Ursaring {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_139_R_EN_LG.png';
    }
}
exports.UrsaringArt = UrsaringArt;
