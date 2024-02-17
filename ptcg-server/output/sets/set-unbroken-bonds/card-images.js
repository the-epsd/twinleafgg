"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokegear30Art = exports.CleffaArt = void 0;
const cleffa_1 = require("./cleffa");
const pokegear_30_1 = require("./pokegear-30");
class CleffaArt extends cleffa_1.Cleffa {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UNB/UNB_131_R_EN.png';
    }
}
exports.CleffaArt = CleffaArt;
class Pokegear30Art extends pokegear_30_1.Pokegear30 {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UNB/UNB_182_R_EN.png';
    }
}
exports.Pokegear30Art = Pokegear30Art;
