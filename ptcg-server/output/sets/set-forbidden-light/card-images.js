"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MalamarArt = exports.InkayArt = void 0;
const inkay_1 = require("./inkay");
const malamar_1 = require("./malamar");
class InkayArt extends inkay_1.Inkay {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLI/FLI_050_R_EN_LG.png';
    }
}
exports.InkayArt = InkayArt;
class MalamarArt extends malamar_1.Malamar {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLI/FLI_051_R_EN_LG.png';
    }
}
exports.MalamarArt = MalamarArt;
