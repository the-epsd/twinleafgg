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
class DarknessEnergyArt extends darkness_energy_1.DarknessEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-7_hiresopt.jpg';
    }
}
exports.DarknessEnergyArt = DarknessEnergyArt;
class FightingEnergyArt extends fighting_energy_1.FightingEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-6_hiresopt.jpg';
    }
}
exports.FightingEnergyArt = FightingEnergyArt;
class FireEnergyArt extends fire_energy_1.FireEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-2_hiresopt.jpg';
    }
}
exports.FireEnergyArt = FireEnergyArt;
class GrassEnergyArt extends grass_energy_1.GrassEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-1_hiresopt.jpg';
    }
}
exports.GrassEnergyArt = GrassEnergyArt;
class LightningEnergyArt extends lightning_energy_1.LightningEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-4_hiresopt.jpg';
    }
}
exports.LightningEnergyArt = LightningEnergyArt;
class MetalEnergyArt extends metal_energy_1.MetalEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-8_hiresopt.jpg';
    }
}
exports.MetalEnergyArt = MetalEnergyArt;
class PsychicEnergyArt extends psychic_energy_1.PsychicEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-5_hiresopt.jpg';
    }
}
exports.PsychicEnergyArt = PsychicEnergyArt;
class WaterEnergyArt extends water_energy_1.WaterEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-3_hiresopt.jpg';
    }
}
exports.WaterEnergyArt = WaterEnergyArt;
