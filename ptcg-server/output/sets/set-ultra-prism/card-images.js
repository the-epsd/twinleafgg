"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurtwigArt = exports.PokemonFanClubArt = exports.GibleArt = void 0;
const gible_1 = require("./gible");
const pokemon_fan_club_1 = require("./pokemon-fan-club");
const turtwig_1 = require("./turtwig");
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
class TurtwigArt extends turtwig_1.Turtwig {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_006_R_EN_LG.png';
    }
}
exports.TurtwigArt = TurtwigArt;
