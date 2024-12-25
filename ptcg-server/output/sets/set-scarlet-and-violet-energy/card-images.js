"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaterEnergyArt = exports.PsychicEnergyArt = exports.MetalEnergyArt = exports.LightningEnergyArt = exports.GrassEnergyArt = exports.FireEnergyArt = exports.FightingEnergyArt = exports.DarknessEnergyArt = void 0;
const darkness_energy_1 = require("./darkness-energy");
const fighting_energy_1 = require("./fighting-energy");
const fire_energy_1 = require("./fire-energy");
const grass_energy_1 = require("./grass-energy");
const lightning_energy_1 = require("./lightning-energy");
const metal_energy_1 = require("./metal-energy");
const psychic_energy_1 = require("./psychic-energy");
const water_energy_1 = require("./water-energy");
// Limitless Imports
class DarknessEnergyArt extends darkness_energy_1.DarknessEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '7';
        this.fullName = 'Darkness Energy';
    }
}
exports.DarknessEnergyArt = DarknessEnergyArt;
class FightingEnergyArt extends fighting_energy_1.FightingEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '6';
        this.fullName = 'Fighting Energy';
    }
}
exports.FightingEnergyArt = FightingEnergyArt;
class FireEnergyArt extends fire_energy_1.FireEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '2';
        this.fullName = 'Fire Energy';
    }
}
exports.FireEnergyArt = FireEnergyArt;
class GrassEnergyArt extends grass_energy_1.GrassEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '1';
        this.fullName = 'Grass Energy';
    }
}
exports.GrassEnergyArt = GrassEnergyArt;
class LightningEnergyArt extends lightning_energy_1.LightningEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '4';
        this.fullName = 'Lightning Energy';
    }
}
exports.LightningEnergyArt = LightningEnergyArt;
class MetalEnergyArt extends metal_energy_1.MetalEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '8';
        this.fullName = 'Metal Energy';
    }
}
exports.MetalEnergyArt = MetalEnergyArt;
class PsychicEnergyArt extends psychic_energy_1.PsychicEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '5';
        this.fullName = 'Psychic Energy';
    }
}
exports.PsychicEnergyArt = PsychicEnergyArt;
class WaterEnergyArt extends water_energy_1.WaterEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '3';
        this.fullName = 'Water Energy';
    }
}
exports.WaterEnergyArt = WaterEnergyArt;
