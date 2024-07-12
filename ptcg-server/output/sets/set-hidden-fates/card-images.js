"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsyduckArt = exports.ErikasHospitalityArt = exports.CharmanderArt = void 0;
const charmander_1 = require("./charmander");
const erikas_hospitality_1 = require("./erikas-hospitality");
const HIF_11_Psyduck_1 = require("./HIF_11_Psyduck");
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
class PsyduckArt extends HIF_11_Psyduck_1.Psyduck {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/HIF/HIF_011_R_EN_LG.png';
    }
}
exports.PsyduckArt = PsyduckArt;
