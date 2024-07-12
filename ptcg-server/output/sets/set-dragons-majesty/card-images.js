"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeraligatrArt = exports.FeebasArt = void 0;
const DRM_24_Feraligatr_1 = require("./DRM_24_Feraligatr");
const feebas_1 = require("./feebas");
class FeebasArt extends feebas_1.Feebas {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DRM/DRM_028_R_EN_LG.png';
    }
}
exports.FeebasArt = FeebasArt;
class FeraligatrArt extends DRM_24_Feraligatr_1.Feraligatr {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DRM/DRM_024_R_EN_LG.png';
    }
}
exports.FeraligatrArt = FeraligatrArt;
