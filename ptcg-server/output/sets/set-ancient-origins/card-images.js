"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnownArt = exports.HexManiacArt = void 0;
const hex_maniac_1 = require("./hex-maniac");
const unown_1 = require("./unown");
class HexManiacArt extends hex_maniac_1.HexManiac {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/AOR/AOR_075_R_EN_LG.png';
    }
}
exports.HexManiacArt = HexManiacArt;
class UnownArt extends unown_1.Unown {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/AOR/AOR_030_R_EN.png';
    }
}
exports.UnownArt = UnownArt;
