"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevitalizerArt = exports.RedCardArt = void 0;
const red_card_1 = require("./red-card");
const revitalizer_1 = require("./revitalizer");
class RedCardArt extends red_card_1.RedCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/GEN/GEN_071_R_EN_LG.png';
    }
}
exports.RedCardArt = RedCardArt;
class RevitalizerArt extends revitalizer_1.Revitalizer {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/GEN/GEN_070_R_EN_LG.png';
    }
}
exports.RevitalizerArt = RevitalizerArt;
