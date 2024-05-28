"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeebasArt = void 0;
const feebas_1 = require("./feebas");
class FeebasArt extends feebas_1.Feebas {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DRM/DRM_028_R_EN_LG.png';
    }
}
exports.FeebasArt = FeebasArt;
