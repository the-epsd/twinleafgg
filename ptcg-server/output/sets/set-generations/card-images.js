"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevitalizerArt = void 0;
const revitalizer_1 = require("./revitalizer");
class RevitalizerArt extends revitalizer_1.Revitalizer {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/GEN/GEN_070_R_EN_LG.png';
    }
}
exports.RevitalizerArt = RevitalizerArt;
