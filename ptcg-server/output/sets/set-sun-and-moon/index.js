"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSunAndMoon = void 0;
const energy_retrieval_1 = require("./energy-retrieval");
const exp_share_1 = require("./exp-share");
const rainbow_energy_1 = require("./rainbow-energy");
const rare_candy_1 = require("./rare-candy");
exports.setSunAndMoon = [
    new energy_retrieval_1.EnergyRetrieval(),
    new exp_share_1.ExpShare(),
    new rainbow_energy_1.RainbowEnergy(),
    new rare_candy_1.RareCandy(),
];
