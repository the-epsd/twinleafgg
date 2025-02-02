"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UxieArt = exports.UnownRArt = void 0;
const unown_r_1 = require("./unown-r");
const uxie_1 = require("./uxie");
class UnownRArt extends unown_r_1.UnownR {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemontcg.io/dp6/77_hires.png';
    }
}
exports.UnownRArt = UnownRArt;
class UxieArt extends uxie_1.Uxie {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemontcg.io/dp6/43_hires.png';
    }
}
exports.UxieArt = UxieArt;
