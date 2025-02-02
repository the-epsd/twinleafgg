"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarknessEnergyEVO = exports.PokedexEVO = void 0;
const pokedex_1 = require("../set-black-and-white/pokedex");
const darkness_energy_1 = require("../set-scarlet-and-violet-energy/darkness-energy");
class PokedexEVO extends pokedex_1.Pokedex {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '82';
        this.fullName = 'Pokedex EVO';
    }
}
exports.PokedexEVO = PokedexEVO;
class DarknessEnergyEVO extends darkness_energy_1.DarknessEnergy {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '97';
        this.fullName = 'Darkness Energy EVO';
    }
}
exports.DarknessEnergyEVO = DarknessEnergyEVO;
