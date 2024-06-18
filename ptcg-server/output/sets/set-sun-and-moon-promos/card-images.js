"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuKokoArt = void 0;
const tapu_koko_1 = require("./tapu-koko");
class TapuKokoArt extends tapu_koko_1.TapuKoko {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SMP/SMP_030_R_EN_LG.png';
    }
}
exports.TapuKokoArt = TapuKokoArt;
