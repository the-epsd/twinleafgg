"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialChargeArt = exports.NinjaBoyArt = void 0;
const ninja_boy_1 = require("./ninja-boy");
const special_charge_1 = require("./special-charge");
class NinjaBoyArt extends ninja_boy_1.NinjaBoy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/STS/STS_103_R_EN.png';
    }
}
exports.NinjaBoyArt = NinjaBoyArt;
class SpecialChargeArt extends special_charge_1.SpeicalCharge {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/STS/STS_105_R_EN_LG.png';
    }
}
exports.SpecialChargeArt = SpecialChargeArt;
