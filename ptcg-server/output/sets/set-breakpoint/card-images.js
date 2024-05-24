"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaryuArt = void 0;
const staryu_1 = require("./staryu");
class StaryuArt extends staryu_1.Staryu {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_025_R_EN_LG.png';
    }
}
exports.StaryuArt = StaryuArt;
