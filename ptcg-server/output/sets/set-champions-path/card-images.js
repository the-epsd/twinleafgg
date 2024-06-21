"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuriffieldStadiumArt = exports.RotomPhoneArt = void 0;
const rotom_phone_1 = require("./rotom-phone");
const turffield_stadium_1 = require("./turffield-stadium");
class RotomPhoneArt extends rotom_phone_1.RotomPhone {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CPA/CPA_064_R_EN_LG.png';
    }
}
exports.RotomPhoneArt = RotomPhoneArt;
class TuriffieldStadiumArt extends turffield_stadium_1.TurffieldStadium {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CPA/CPA_068_R_EN_LG.png';
    }
}
exports.TuriffieldStadiumArt = TuriffieldStadiumArt;
