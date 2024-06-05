"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErikasHospitalityArt = exports.CharmanderArt = void 0;
const charmander_1 = require("./charmander");
const erikas_hospitality_1 = require("./erikas-hospitality");
class CharmanderArt extends charmander_1.Charmander {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/HIF/HIF_007_R_EN.png';
    }
}
exports.CharmanderArt = CharmanderArt;
class ErikasHospitalityArt extends erikas_hospitality_1.ErikasHospitality {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/HIF/HIF_056_R_EN_LG.png';
    }
}
exports.ErikasHospitalityArt = ErikasHospitalityArt;
