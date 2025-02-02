"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RayquazaVMAXAA = exports.RayquazaVAA = void 0;
const rayquaza_v_1 = require("./rayquaza-v");
const rayquaza_vmax_1 = require("./rayquaza-vmax");
class RayquazaVAA extends rayquaza_v_1.RayquazaV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVS/EVS_194_R_EN.png';
        this.setNumber = '194';
    }
}
exports.RayquazaVAA = RayquazaVAA;
class RayquazaVMAXAA extends rayquaza_vmax_1.RayquazaVMAX {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVS/EVS_218_R_EN_LG.png';
        this.setNumber = '218';
    }
}
exports.RayquazaVMAXAA = RayquazaVMAXAA;
