"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RioluArt = exports.NArt = exports.MewArt = exports.LucarioArt = exports.FennekinArt = void 0;
const fennekin_1 = require("./fennekin");
const lucario_1 = require("./lucario");
const mew_1 = require("./mew");
const n_1 = require("./n");
const riolu_1 = require("./riolu");
class FennekinArt extends fennekin_1.Fennekin {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FCO/FCO_010_R_EN_LG.png';
    }
}
exports.FennekinArt = FennekinArt;
class LucarioArt extends lucario_1.Lucario {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FCO/FCO_063_R_EN_LG.png';
    }
}
exports.LucarioArt = LucarioArt;
class MewArt extends mew_1.Mew {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FCO/FCO_029_R_EN.png';
    }
}
exports.MewArt = MewArt;
class NArt extends n_1.N {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FCO/FCO_105_R_EN_LG.png';
    }
}
exports.NArt = NArt;
class RioluArt extends riolu_1.Riolu {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FCO/FCO_045_R_EN_LG.png';
    }
}
exports.RioluArt = RioluArt;
