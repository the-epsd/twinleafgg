"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEvolutions = void 0;
const other_prints_1 = require("./other-prints");
const devolution_spray_1 = require("./devolution-spray");
const dragonite_ex_1 = require("./dragonite-ex");
const electabuzz_1 = require("./electabuzz");
const poliwhirl_1 = require("./poliwhirl");
const starmie_1 = require("./starmie");
exports.setEvolutions = [
    new devolution_spray_1.DevolutionSpray(),
    new dragonite_ex_1.DragoniteEX(),
    new electabuzz_1.Electabuzz(),
    new other_prints_1.PokedexEVO(),
    new poliwhirl_1.Poliwhirl(),
    new starmie_1.Starmie(),
    //Energy
    new other_prints_1.DarknessEnergyEVO(),
];
