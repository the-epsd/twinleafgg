"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeckoArt = exports.ChikoritaArt = void 0;
const chikorita_1 = require("./chikorita");
const treecko_1 = require("./treecko");
class ChikoritaArt extends chikorita_1.Chikorita {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LOT/LOT_006_R_EN_LG.png';
    }
}
exports.ChikoritaArt = ChikoritaArt;
class TreeckoArt extends treecko_1.Treecko {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LOT/LOT_020_R_EN_LG.png';
    }
}
exports.TreeckoArt = TreeckoArt;
