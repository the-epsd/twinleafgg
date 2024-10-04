"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharmeleonArt = void 0;
const charmeleon_1 = require("./charmeleon");
class CharmeleonArt extends charmeleon_1.Charmeleon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/GEN/GEN_RC4_R_EN_LG.png';
    }
}
exports.CharmeleonArt = CharmeleonArt;
