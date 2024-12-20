"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEvolutions = void 0;
const pokedex_1 = require("../set-base-set/pokedex");
const HS_121_Darkness_Energy_1 = require("../set-heartgold-and-soulsilver/HS_121_Darkness_Energy");
const devolution_spray_1 = require("./devolution-spray");
const dragonite_ex_1 = require("./dragonite-ex");
const electabuzz_1 = require("./electabuzz");
const poliwhirl_1 = require("./poliwhirl");
const starmie_1 = require("./starmie");
exports.setEvolutions = [
    new devolution_spray_1.DevolutionSpray(),
    new dragonite_ex_1.DragoniteEX(),
    new electabuzz_1.Electabuzz(),
    new pokedex_1.Pokedex(),
    new poliwhirl_1.Poliwhirl(),
    new starmie_1.Starmie(),
    //Energy
    new HS_121_Darkness_Energy_1.DarknessEnergy(),
];
