"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperScoopUpArt = exports.PokedexHandyArt = void 0;
const pokedex_handy_1 = require("./pokedex-handy");
const super_scoop_up_1 = require("./super-scoop-up");
class PokedexHandyArt extends pokedex_handy_1.PokedexHandy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemontcg.io/dp1/111_hires.png';
    }
}
exports.PokedexHandyArt = PokedexHandyArt;
class SuperScoopUpArt extends super_scoop_up_1.SuperScoopUp {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemontcg.io/dp1/111_hires.png';
    }
}
exports.SuperScoopUpArt = SuperScoopUpArt;
