"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScytherArt = exports.PokeBallArt = exports.DodrioArt = exports.ClefableArt = void 0;
const clefable_1 = require("./clefable");
const dodrio_1 = require("./dodrio");
const pokeball_1 = require("./pokeball");
const scyther_1 = require("./scyther");
class ClefableArt extends clefable_1.Clefable {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/clefable-jungle-ju-1.jpg?fit=600%2C825&ssl=1';
    }
}
exports.ClefableArt = ClefableArt;
class DodrioArt extends dodrio_1.Dodrio {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/dodrio-jungle-ju-34.jpg?fit=600%2C825&ssl=1';
    }
}
exports.DodrioArt = DodrioArt;
class PokeBallArt extends pokeball_1.PokeBall {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/poke-ball-jungle-ju-64.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PokeBallArt = PokeBallArt;
class ScytherArt extends scyther_1.Scyther {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/scyther-jungle-ju-10.jpg?fit=600%2C825&ssl=1';
    }
}
exports.ScytherArt = ScytherArt;
