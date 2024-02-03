"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrFujiArt = exports.LaprasArt = exports.EnergySearchArt = exports.ArticunoArt = void 0;
const articuno_1 = require("./articuno");
const energy_search_1 = require("./energy-search");
const lapras_1 = require("./lapras");
const mr_fuji_1 = require("./mr-fuji");
class ArticunoArt extends articuno_1.Articuno {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/articuno-fossil-fo-2.jpg?fit=600%2C825&ssl=1';
    }
}
exports.ArticunoArt = ArticunoArt;
class EnergySearchArt extends energy_search_1.EnergySearch {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/energy-search-fossil-fo-59.jpg?fit=600%2C825&ssl=1';
    }
}
exports.EnergySearchArt = EnergySearchArt;
class LaprasArt extends lapras_1.Lapras {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/lapras-fossil-fo-10.jpg?fit=600%2C825&ssl=1';
    }
}
exports.LaprasArt = LaprasArt;
class MrFujiArt extends mr_fuji_1.MrFuji {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/mr.-fuji-fossil-fo-58.jpg?fit=600%2C825&ssl=1';
    }
}
exports.MrFujiArt = MrFujiArt;
