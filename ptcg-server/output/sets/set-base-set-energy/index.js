"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBaseSetEnergy = void 0;
const fighting_energy_1 = require("./fighting-energy");
const fire_energy_1 = require("./fire-energy");
const grass_energy_1 = require("./grass-energy");
const lightning_energy_1 = require("./lightning-energy");
const psychic_energy_1 = require("./psychic-energy");
const water_energy_1 = require("./water-energy");
exports.setBaseSetEnergy = [
    new fighting_energy_1.FightingEnergy(),
    new fire_energy_1.FireEnergy(),
    new grass_energy_1.GrassEnergy(),
    new lightning_energy_1.LightningEnergy(),
    new psychic_energy_1.PsychicEnergy(),
    new water_energy_1.WaterEnergy(),
];
