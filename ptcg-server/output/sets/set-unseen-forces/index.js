"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUnseenForces = void 0;
const marys_request_1 = require("./marys-request");
const pokemon_reversal_1 = require("./pokemon-reversal");
const stantler_1 = require("./stantler");
exports.setUnseenForces = [
    new marys_request_1.MarysRequest(),
    new pokemon_reversal_1.PokemonReversal(),
    new stantler_1.Stantler()
];
