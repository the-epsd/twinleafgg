"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonFanClubArt = exports.GibleArt = void 0;
const gible_1 = require("./gible");
const pokemon_fan_club_1 = require("./pokemon-fan-club");
class GibleArt extends gible_1.Gible {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_096_R_EN.png';
    }
}
exports.GibleArt = GibleArt;
class PokemonFanClubArt extends pokemon_fan_club_1.PokemonFanClub {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_133_R_EN.png';
    }
}
exports.PokemonFanClubArt = PokemonFanClubArt;
