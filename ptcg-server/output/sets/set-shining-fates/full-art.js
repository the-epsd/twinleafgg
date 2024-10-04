"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnomSVArt = exports.ApplinArt = void 0;
const applin_1 = require("./applin");
const snom_1 = require("./snom");
class ApplinArt extends applin_1.Applin {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SHF/SHF_SV12_R_EN_LG.png';
    }
}
exports.ApplinArt = ApplinArt;
class SnomSVArt extends snom_1.Snom {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SHF/SHF_SV33_R_EN_LG.png';
        this.setNumber = 'SV33';
    }
}
exports.SnomSVArt = SnomSVArt;
