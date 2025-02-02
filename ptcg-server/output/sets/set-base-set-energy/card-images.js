"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaterEnergyArt = exports.PsychicEnergyArt = exports.LightningEnergyArt = exports.GrassEnergyArt = exports.FireEnergyArt = exports.FightingEnergyArt = void 0;
const fighting_energy_1 = require("./fighting-energy");
const fire_energy_1 = require("./fire-energy");
const grass_energy_1 = require("./grass-energy");
const lightning_energy_1 = require("./lightning-energy");
const psychic_energy_1 = require("./psychic-energy");
const water_energy_1 = require("./water-energy");
class FightingEnergyArt extends fighting_energy_1.FightingEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/fighting-energy-base-set-bs-97.jpg?fit=600%2C825&ssl=1';
    }
}
exports.FightingEnergyArt = FightingEnergyArt;
class FireEnergyArt extends fire_energy_1.FireEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/fire-energy-base-set-bs-98.jpg?fit=600%2C825&ssl=1';
    }
}
exports.FireEnergyArt = FireEnergyArt;
class GrassEnergyArt extends grass_energy_1.GrassEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/grass-energy-base-set-bs-99.jpg?fit=600%2C825&ssl=1';
    }
}
exports.GrassEnergyArt = GrassEnergyArt;
class LightningEnergyArt extends lightning_energy_1.LightningEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/lightning-energy-base-set-bs-100.jpg?fit=600%2C825&ssl=1';
    }
}
exports.LightningEnergyArt = LightningEnergyArt;
class PsychicEnergyArt extends psychic_energy_1.PsychicEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/psychic-energy-base-set-bs-101.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PsychicEnergyArt = PsychicEnergyArt;
class WaterEnergyArt extends water_energy_1.WaterEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/water-energy-base-set-bs-102.jpg?fit=600%2C825&ssl=1';
    }
}
exports.WaterEnergyArt = WaterEnergyArt;
