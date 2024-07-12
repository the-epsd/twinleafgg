"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarmieArt = exports.PoliwhirlArt = exports.PokedexArt = exports.ElectabuzzArt = exports.DevolutionSprayArt = void 0;
const devolution_spray_1 = require("./devolution-spray");
const electabuzz_1 = require("./electabuzz");
const EVO_24_Poliwhirl_1 = require("./EVO_24_Poliwhirl");
const pokedex_1 = require("./pokedex");
const starmie_1 = require("./starmie");
class DevolutionSprayArt extends devolution_spray_1.DevolutionSpray {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_076_R_EN_LG.png';
    }
}
exports.DevolutionSprayArt = DevolutionSprayArt;
class ElectabuzzArt extends electabuzz_1.Electabuzz {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_041_R_EN.png';
    }
}
exports.ElectabuzzArt = ElectabuzzArt;
class PokedexArt extends pokedex_1.Pokedex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_082_R_EN_LG.png';
    }
}
exports.PokedexArt = PokedexArt;
class PoliwhirlArt extends EVO_24_Poliwhirl_1.Poliwhirl {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_024_R_EN_LG.png';
    }
}
exports.PoliwhirlArt = PoliwhirlArt;
class StarmieArt extends starmie_1.Starmie {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_031_R_EN_LG.png';
    }
}
exports.StarmieArt = StarmieArt;
