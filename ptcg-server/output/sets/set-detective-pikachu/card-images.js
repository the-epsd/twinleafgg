"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulbasaurArt = void 0;
const bulbasaur_1 = require("./bulbasaur");
class BulbasaurArt extends bulbasaur_1.Bulbasaur {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DET/DET_001_R_EN_LG.png';
    }
}
exports.BulbasaurArt = BulbasaurArt;
