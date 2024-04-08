"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragapultexArt = exports.DrakloakArt = exports.DreepyArt = void 0;
const dragapult_ex_1 = require("./dragapult-ex");
const drakloak_1 = require("./drakloak");
const dreepy_1 = require("./dreepy");
class DreepyArt extends dreepy_1.Dreepy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://www.pokebeach.com/news/2024/04/pokemonex-card-6.png';
    }
}
exports.DreepyArt = DreepyArt;
class DrakloakArt extends drakloak_1.Drakloak {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://www.pokebeach.com/news/2024/04/pokemonex-card-5.png';
    }
}
exports.DrakloakArt = DrakloakArt;
class DragapultexArt extends dragapult_ex_1.Dragapultex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://www.pokebeach.com/news/2024/04/pokemonex-card-4.png';
    }
}
exports.DragapultexArt = DragapultexArt;
