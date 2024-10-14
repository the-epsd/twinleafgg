"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpertBeltArt = void 0;
const expert_belt_1 = require("./expert-belt");
class ExpertBeltArt extends expert_belt_1.ExpertBelt {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemontcg.io/pl4/87_hires.png';
    }
}
exports.ExpertBeltArt = ExpertBeltArt;
