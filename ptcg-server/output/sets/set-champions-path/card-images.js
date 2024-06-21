"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotomPhoneArt = void 0;
const rotom_phone_1 = require("./rotom-phone");
class RotomPhoneArt extends rotom_phone_1.RotomPhone {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CPA/CPA_064_R_EN_LG.png';
    }
}
exports.RotomPhoneArt = RotomPhoneArt;
