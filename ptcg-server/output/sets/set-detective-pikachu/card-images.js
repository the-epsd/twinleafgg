"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreninjaArt = exports.BulbasaurArt = void 0;
const bulbasaur_1 = require("./bulbasaur");
const greninja_1 = require("./greninja");
class BulbasaurArt extends bulbasaur_1.Bulbasaur {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DET/DET_001_R_EN_LG.png';
    }
}
exports.BulbasaurArt = BulbasaurArt;
class GreninjaArt extends greninja_1.Greninja {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DET/DET_009_R_EN_LG.png';
    }
}
exports.GreninjaArt = GreninjaArt;
