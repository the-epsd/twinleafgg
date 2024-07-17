"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplinArt = void 0;
const SHF_SV12_Applin_1 = require("./SHF_SV12_Applin");
class ApplinArt extends SHF_SV12_Applin_1.Applin {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SHF/SHF_SV12_R_EN_LG.png';
    }
}
exports.ApplinArt = ApplinArt;
