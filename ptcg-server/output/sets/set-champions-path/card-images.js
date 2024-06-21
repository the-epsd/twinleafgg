"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuriffieldStadiumArt = exports.SoniaArt = exports.RotomPhoneArt = exports.PiersArt = void 0;
const piers_1 = require("./piers");
const rotom_phone_1 = require("./rotom-phone");
const sonia_1 = require("./sonia");
const turffield_stadium_1 = require("./turffield-stadium");
class PiersArt extends piers_1.Piers {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CPA/CPA_058_R_EN_LG.png';
    }
}
exports.PiersArt = PiersArt;
class RotomPhoneArt extends rotom_phone_1.RotomPhone {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CPA/CPA_064_R_EN_LG.png';
    }
}
exports.RotomPhoneArt = RotomPhoneArt;
class SoniaArt extends sonia_1.Sonia {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CPA/CPA_065_R_EN_LG.png';
    }
}
exports.SoniaArt = SoniaArt;
class TuriffieldStadiumArt extends turffield_stadium_1.TurffieldStadium {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CPA/CPA_068_R_EN_LG.png';
    }
}
exports.TuriffieldStadiumArt = TuriffieldStadiumArt;
