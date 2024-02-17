"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViridianForestArt = exports.PokemonCommunicationArt = void 0;
const pokemon_communication_1 = require("./pokemon-communication");
const viridian_forest_1 = require("./viridian-forest");
class PokemonCommunicationArt extends pokemon_communication_1.PokemonCommunication {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEU/TEU_152_R_EN.png';
    }
}
exports.PokemonCommunicationArt = PokemonCommunicationArt;
class ViridianForestArt extends viridian_forest_1.ViridianForest {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEU/TEU_156_R_EN.png';
    }
}
exports.ViridianForestArt = ViridianForestArt;
