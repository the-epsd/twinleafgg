"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RioluArt = exports.LucarioArt = void 0;
const lucario_1 = require("./lucario");
const riolu_1 = require("./riolu");
class LucarioArt extends lucario_1.Lucario {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FCO/FCO_063_R_EN_LG.png';
    }
}
exports.LucarioArt = LucarioArt;
class RioluArt extends riolu_1.Riolu {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FCO/FCO_045_R_EN_LG.png';
    }
}
exports.RioluArt = RioluArt;
