"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharmeleonArt = void 0;
const GEN_RC4_Charmeleon_1 = require("./GEN_RC4_Charmeleon");
class CharmeleonArt extends GEN_RC4_Charmeleon_1.Charmeleon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/GEN/GEN_RC4_R_EN_LG.png';
    }
}
exports.CharmeleonArt = CharmeleonArt;
