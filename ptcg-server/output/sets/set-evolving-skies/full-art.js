"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RayquazaVMAXAA = exports.RayquazaVAA = void 0;
const rayquaza_v_1 = require("./rayquaza-v");
const rayquaza_vmax_1 = require("./rayquaza-vmax");
class RayquazaVAA extends rayquaza_v_1.RayquazaV {
    constructor() {
        super(...arguments);
        this.setNumber = '194';
        this.fullName = 'RayquazaVAA EVS';
    }
}
exports.RayquazaVAA = RayquazaVAA;
class RayquazaVMAXAA extends rayquaza_vmax_1.RayquazaVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = '218';
        this.fullName = 'RayquazaVMAXAA EVS';
    }
}
exports.RayquazaVMAXAA = RayquazaVMAXAA;
