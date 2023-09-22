"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTeamUp = void 0;
const pokemon_communication_1 = require("./pokemon-communication");
const viridian_forest_1 = require("./viridian-forest");
exports.setTeamUp = [
    new pokemon_communication_1.PokemonCommunication(),
    new viridian_forest_1.ViridianForest(),
];
