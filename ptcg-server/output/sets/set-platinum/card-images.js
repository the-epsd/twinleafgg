"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonRescueArt = exports.PokeTurnArt = exports.CrobatGArt = void 0;
const crobat_g_1 = require("./crobat-g");
const poke_turn_1 = require("./poke-turn");
const pokemon_rescue_1 = require("./pokemon-rescue");
class CrobatGArt extends crobat_g_1.CrobatG {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/crobat-g-platinum-pl-47.jpg?fit=600%2C825&ssl=1';
    }
}
exports.CrobatGArt = CrobatGArt;
class PokeTurnArt extends poke_turn_1.PokeTurn {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemontcg.io/pl1/118_hires.png';
    }
}
exports.PokeTurnArt = PokeTurnArt;
class PokemonRescueArt extends pokemon_rescue_1.PokemonRescue {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemontcg.io/pl1/115_hires.png';
    }
}
exports.PokemonRescueArt = PokemonRescueArt;
