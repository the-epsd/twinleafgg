"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEXLegendMaker = void 0;
const giant_stump_1 = require("./giant-stump");
const kecleon_1 = require("./kecleon");
const lapras_1 = require("./lapras");
const pikachu_1 = require("./pikachu");
exports.setEXLegendMaker = [
    new giant_stump_1.GiantStump(),
    new kecleon_1.Kecleon(),
    new lapras_1.Lapras(),
    new pikachu_1.Pikachu(),
];
