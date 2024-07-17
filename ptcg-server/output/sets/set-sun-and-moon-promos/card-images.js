"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuKokoArt = exports.LurantisArt = void 0;
const SMP_25_Lurantis_1 = require("./SMP_25_Lurantis");
const tapu_koko_1 = require("./tapu-koko");
class LurantisArt extends SMP_25_Lurantis_1.Lurantis {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SMP/SMP_025_R_EN_LG.png';
    }
}
exports.LurantisArt = LurantisArt;
class TapuKokoArt extends tapu_koko_1.TapuKoko {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SMP/SMP_030_R_EN_LG.png';
    }
}
exports.TapuKokoArt = TapuKokoArt;
