"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaryuArt = exports.DelinquentArt = void 0;
const delinquent_1 = require("./delinquent");
const staryu_1 = require("./staryu");
class DelinquentArt extends delinquent_1.Delinquent {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_098_R_EN_LG.png';
    }
}
exports.DelinquentArt = DelinquentArt;
class StaryuArt extends staryu_1.Staryu {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_025_R_EN_LG.png';
    }
}
exports.StaryuArt = StaryuArt;
