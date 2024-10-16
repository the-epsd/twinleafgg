"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnownQArt = void 0;
const unown_q_1 = require("./unown-q");
class UnownQArt extends unown_q_1.UnownQ {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemontcg.io/dp5/49_hires.png';
    }
}
exports.UnownQArt = UnownQArt;
