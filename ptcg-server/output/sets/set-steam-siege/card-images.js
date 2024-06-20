"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialChargeArt = void 0;
const special_charge_1 = require("./special-charge");
class SpecialChargeArt extends special_charge_1.SpeicalCharge {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/STS/STS_105_R_EN_LG.png';
    }
}
exports.SpecialChargeArt = SpecialChargeArt;
