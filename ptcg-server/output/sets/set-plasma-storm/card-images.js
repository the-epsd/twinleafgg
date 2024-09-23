"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZubatArt = exports.VirbankCityGymArt = exports.ScrambleSwitchArt = exports.RaltsArt = exports.PlasmaEnergyArt = exports.PhanpyArt = exports.LugiaExArt = exports.KirliaArt = exports.HypnotoxicLaserArt = exports.GalladeArt = exports.EtherArt = exports.EscapeRopeArt = exports.DowsingMachineArt = exports.DonphanArt = exports.ColressArt = exports.BicycleArt = void 0;
const escape_rope_1 = require("../set-battle-styles/escape-rope");
const bicycle_1 = require("./bicycle");
const colress_1 = require("./colress");
const donphan_1 = require("./donphan");
const dowsing_machine_1 = require("./dowsing-machine");
const ether_1 = require("./ether");
const gallade_1 = require("./gallade");
const hypnotoxic_laser_1 = require("./hypnotoxic-laser");
const kirlia_1 = require("./kirlia");
const lugia_ex_1 = require("./lugia-ex");
const phanpy_1 = require("./phanpy");
const plasma_energy_1 = require("./plasma-energy");
const ralts_1 = require("./ralts");
const scramble_switch_1 = require("./scramble-switch");
const virbank_city_gym_1 = require("./virbank-city-gym");
const zubat_1 = require("./zubat");
class BicycleArt extends bicycle_1.Bicycle {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_117_R_EN.png';
    }
}
exports.BicycleArt = BicycleArt;
class ColressArt extends colress_1.Colress {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_118_R_EN.png';
    }
}
exports.ColressArt = ColressArt;
class DonphanArt extends donphan_1.Donphan {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_072_R_EN.png';
    }
}
exports.DonphanArt = DonphanArt;
class DowsingMachineArt extends dowsing_machine_1.DowsingMachine {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_128_R_EN.png';
    }
}
exports.DowsingMachineArt = DowsingMachineArt;
class EscapeRopeArt extends escape_rope_1.EscapeRope {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_120_R_EN.png';
        this.set = 'PLS';
        this.setNumber = '120';
        this.fullName = 'Escape Rope PLS';
    }
}
exports.EscapeRopeArt = EscapeRopeArt;
class EtherArt extends ether_1.Ether {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_121s_R_EN.png';
    }
}
exports.EtherArt = EtherArt;
class GalladeArt extends gallade_1.Gallade {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_061_R_EN.png';
    }
}
exports.GalladeArt = GalladeArt;
class HypnotoxicLaserArt extends hypnotoxic_laser_1.HypnotoxicLaser {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_123_R_EN.png';
    }
}
exports.HypnotoxicLaserArt = HypnotoxicLaserArt;
class KirliaArt extends kirlia_1.Kirlia {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_060_R_EN.png';
    }
}
exports.KirliaArt = KirliaArt;
class LugiaExArt extends lugia_ex_1.LugiaEx {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_108_R_EN.png';
    }
}
exports.LugiaExArt = LugiaExArt;
class PhanpyArt extends phanpy_1.Phanpy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_071_R_EN.png';
    }
}
exports.PhanpyArt = PhanpyArt;
class PlasmaEnergyArt extends plasma_energy_1.PlasmaEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_127_R_EN.png';
    }
}
exports.PlasmaEnergyArt = PlasmaEnergyArt;
class RaltsArt extends ralts_1.Ralts {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_059_R_EN.png';
    }
}
exports.RaltsArt = RaltsArt;
class ScrambleSwitchArt extends scramble_switch_1.ScrambleSwitch {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_129_R_EN.png';
    }
}
exports.ScrambleSwitchArt = ScrambleSwitchArt;
class VirbankCityGymArt extends virbank_city_gym_1.VirbankCityGym {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_126_R_EN.png';
    }
}
exports.VirbankCityGymArt = VirbankCityGymArt;
class ZubatArt extends zubat_1.Zubat {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLS/PLS_053_R_EN.png';
    }
}
exports.ZubatArt = ZubatArt;
