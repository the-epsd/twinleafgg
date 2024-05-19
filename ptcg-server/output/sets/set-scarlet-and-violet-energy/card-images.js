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
// export class DarknessEnergyArt extends DarknessEnergy {
//   public cardImage = 'https://images.pokemoncard.io/images/sve/sve-7_hiresopt.jpg';
// }
// export class FightingEnergyArt extends FightingEnergy {
//   public cardImage = 'https://images.pokemoncard.io/images/sve/sve-6_hiresopt.jpg';
// }
// export class FireEnergyArt extends FireEnergy {
//   public cardImage = 'https://images.pokemoncard.io/images/sve/sve-2_hiresopt.jpg';
// }
// export class GrassEnergyArt extends GrassEnergy {
//   public cardImage = 'https://images.pokemoncard.io/images/sve/sve-1_hiresopt.jpg';
// }
// export class LightningEnergyArt extends LightningEnergy {
//   public cardImage = 'https://images.pokemoncard.io/images/sve/sve-4_hiresopt.jpg';
// }
// export class MetalEnergyArt extends MetalEnergy {
//   public cardImage = 'https://images.pokemoncard.io/images/sve/sve-8_hiresopt.jpg';
// }
// export class PsychicEnergyArt extends PsychicEnergy {
//   public cardImage = 'https://images.pokemoncard.io/images/sve/sve-5_hiresopt.jpg';
// }
// export class WaterEnergyArt extends WaterEnergy {
//   public cardImage = 'https://images.pokemoncard.io/images/sve/sve-3_hiresopt.jpg';
// }
// Limitless Imports
class DarknessEnergyArt extends darkness_energy_1.DarknessEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '7';
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-7_hiresopt.jpg';
        this.fullName = 'Darkness Energy';
    }
}
exports.DarknessEnergyArt = DarknessEnergyArt;
class FightingEnergyArt extends fighting_energy_1.FightingEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '6';
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-6_hiresopt.jpg';
        this.fullName = 'Fighting Energy';
    }
}
exports.FightingEnergyArt = FightingEnergyArt;
class FireEnergyArt extends fire_energy_1.FireEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '2';
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-2_hiresopt.jpg';
        this.fullName = 'Fire Energy';
    }
}
exports.FireEnergyArt = FireEnergyArt;
class GrassEnergyArt extends grass_energy_1.GrassEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '1';
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-1_hiresopt.jpg';
        this.fullName = 'Grass Energy';
    }
}
exports.GrassEnergyArt = GrassEnergyArt;
class LightningEnergyArt extends lightning_energy_1.LightningEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '4';
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-4_hiresopt.jpg';
        this.fullName = 'Lightning Energy';
    }
}
exports.LightningEnergyArt = LightningEnergyArt;
class MetalEnergyArt extends metal_energy_1.MetalEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '8';
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-8_hiresopt.jpg';
        this.fullName = 'Metal Energy';
    }
}
exports.MetalEnergyArt = MetalEnergyArt;
class PsychicEnergyArt extends psychic_energy_1.PsychicEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '5';
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-5_hiresopt.jpg';
        this.fullName = 'Psychic Energy';
    }
}
exports.PsychicEnergyArt = PsychicEnergyArt;
class WaterEnergyArt extends water_energy_1.WaterEnergy {
    constructor() {
        super(...arguments);
        this.set = '';
        this.setNumber = '3';
        this.cardImage = 'https://images.pokemoncard.io/images/sve/sve-3_hiresopt.jpg';
        this.fullName = 'Water Energy';
    }
}
exports.WaterEnergyArt = WaterEnergyArt;
