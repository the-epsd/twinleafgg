"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuagsireArt = exports.WooperArt = exports.PsyduckArt = exports.ErikasHospitalityArt = exports.CharmanderArt = void 0;
const quagsire_1 = require("../set-dragons-majesty/quagsire");
const wooper_1 = require("../set-dragons-majesty/wooper");
const charmander_1 = require("./charmander");
const erikas_hospitality_1 = require("./erikas-hospitality");
const psyduck_1 = require("./psyduck");
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
class PsyduckArt extends psyduck_1.Psyduck {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/HIF/HIF_011_R_EN_LG.png';
    }
}
exports.PsyduckArt = PsyduckArt;
class WooperArt extends wooper_1.Wooper {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/HIF/HIF_SV9_R_EN_LG.png';
        this.fullName = 'Wooper HIF';
        this.set = 'HIF';
        this.setNumber = 'SV9';
    }
}
exports.WooperArt = WooperArt;
class QuagsireArt extends quagsire_1.Quagsire {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/HIF/HIF_SV10_R_EN_LG.png';
        this.fullName = 'Quagsire HIF';
        this.set = 'HIF';
        this.setNumber = 'SV10';
    }
}
exports.QuagsireArt = QuagsireArt;
