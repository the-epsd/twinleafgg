"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RayquazaArt = void 0;
const rayquaza_1 = require("./rayquaza");
class RayquazaArt extends rayquaza_1.Rayquaza {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DRV/DRV_011_R_EN.png';
    }
}
exports.RayquazaArt = RayquazaArt;
