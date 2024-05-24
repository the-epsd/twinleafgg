"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiningGenesectArt = exports.MarshadowArt = void 0;
const marshadow_1 = require("./marshadow");
const shining_genesect_1 = require("./shining-genesect");
class MarshadowArt extends marshadow_1.Marshadow {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SLG/SLG_045_R_EN.png';
    }
}
exports.MarshadowArt = MarshadowArt;
class ShiningGenesectArt extends shining_genesect_1.ShiningGenesect {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SLG/SLG_009_R_EN.png';
    }
}
exports.ShiningGenesectArt = ShiningGenesectArt;
