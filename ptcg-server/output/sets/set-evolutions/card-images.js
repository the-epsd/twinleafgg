"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarknessEnergyArt = exports.StarmieArt = exports.PoliwhirlArt = exports.PokedexArt = exports.ElectabuzzArt = exports.DragoniteEXArt = exports.DevolutionSprayArt = void 0;
const pokedex_1 = require("../set-black-and-white/pokedex");
const darkness_energy_1 = require("../set-scarlet-and-violet-energy/darkness-energy");
const devolution_spray_1 = require("./devolution-spray");
const dragonite_ex_1 = require("./dragonite-ex");
const electabuzz_1 = require("./electabuzz");
const poliwhirl_1 = require("./poliwhirl");
const starmie_1 = require("./starmie");
class DevolutionSprayArt extends devolution_spray_1.DevolutionSpray {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_076_R_EN_LG.png';
    }
}
exports.DevolutionSprayArt = DevolutionSprayArt;
class DragoniteEXArt extends dragonite_ex_1.DragoniteEX {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_072_R_EN.png';
    }
}
exports.DragoniteEXArt = DragoniteEXArt;
class ElectabuzzArt extends electabuzz_1.Electabuzz {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_041_R_EN.png';
    }
}
exports.ElectabuzzArt = ElectabuzzArt;
class PokedexArt extends pokedex_1.Pokedex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_082_R_EN_LG.png';
        this.set = 'EVO';
        this.setNumber = '98';
        this.fullName = 'Pokedex EVO';
    }
}
exports.PokedexArt = PokedexArt;
class PoliwhirlArt extends poliwhirl_1.Poliwhirl {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_024_R_EN_LG.png';
    }
}
exports.PoliwhirlArt = PoliwhirlArt;
class StarmieArt extends starmie_1.Starmie {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_031_R_EN_LG.png';
    }
}
exports.StarmieArt = StarmieArt;
//Energy
class DarknessEnergyArt extends darkness_energy_1.DarknessEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_097_R_EN.png';
        this.set = 'EVO';
        this.setNumber = '97';
        this.fullName = 'Darkness Energy EVO';
    }
}
exports.DarknessEnergyArt = DarknessEnergyArt;
