"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NecrozmaArt = void 0;
const necrozma_1 = require("./necrozma");
class NecrozmaArt extends necrozma_1.Necrozma {
    constructor() {
        super(...arguments);
        this.cardimage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UNM/UNM_101_R_EN_LG.png';
    }
}
exports.NecrozmaArt = NecrozmaArt;
