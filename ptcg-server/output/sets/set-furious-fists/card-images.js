"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingCenterArt = exports.StrongEnergyArt = exports.SeismitoadExArt = exports.LucarioExArt = exports.KorrinaArt = exports.HawluchaArt = exports.FightingStadiumArt = exports.DedenneArt = void 0;
const dedenne_1 = require("./dedenne");
const fighting_stadium_1 = require("./fighting-stadium");
const hawlucha_1 = require("./hawlucha");
const korrina_1 = require("./korrina");
const lucario_ex_1 = require("./lucario-ex");
const seismitoad_ex_1 = require("./seismitoad-ex");
const strong_energy_1 = require("./strong-energy");
const training_center_1 = require("./training-center");
class DedenneArt extends dedenne_1.Dedenne {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FFI/FFI_034_R_EN.png';
    }
}
exports.DedenneArt = DedenneArt;
class FightingStadiumArt extends fighting_stadium_1.FightingStadium {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FFI/FFI_034_R_EN.png';
    }
}
exports.FightingStadiumArt = FightingStadiumArt;
class HawluchaArt extends hawlucha_1.Hawlucha {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FFI/FFI_034_R_EN.png';
    }
}
exports.HawluchaArt = HawluchaArt;
class KorrinaArt extends korrina_1.Korrina {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FFI/FFI_034_R_EN.png';
    }
}
exports.KorrinaArt = KorrinaArt;
class LucarioExArt extends lucario_ex_1.LucarioEx {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FFI/FFI_034_R_EN.png';
    }
}
exports.LucarioExArt = LucarioExArt;
class SeismitoadExArt extends seismitoad_ex_1.SeismitoadEx {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FFI/FFI_034_R_EN.png';
    }
}
exports.SeismitoadExArt = SeismitoadExArt;
class StrongEnergyArt extends strong_energy_1.StrongEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FFI/FFI_034_R_EN.png';
    }
}
exports.StrongEnergyArt = StrongEnergyArt;
class TrainingCenterArt extends training_center_1.TrainingCenter {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FFI/FFI_034_R_EN.png';
    }
}
exports.TrainingCenterArt = TrainingCenterArt;
