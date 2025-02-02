"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPowerKeepers = void 0;
const energy_removal_2_1 = require("./energy-removal-2");
const stevens_advice_1 = require("./stevens-advice");
exports.setPowerKeepers = [
    new energy_removal_2_1.EnergyRemoval2(),
    new stevens_advice_1.StevensAdvice()
];
