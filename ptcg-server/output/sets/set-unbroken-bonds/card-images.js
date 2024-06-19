"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolcanionArt = exports.PorygonZArt = exports.Pokegear30Art = exports.MewArt = exports.CleffaArt = exports.ArcanineArt = void 0;
const arcanine_1 = require("./arcanine");
const cleffa_1 = require("./cleffa");
const mew_1 = require("./mew");
const pokegear_30_1 = require("./pokegear-30");
const porygon_z_1 = require("./porygon-z");
const volcanion_1 = require("./volcanion");
class ArcanineArt extends arcanine_1.Arcanine {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UNB/UNB_022_R_EN_LG.png';
    }
}
exports.ArcanineArt = ArcanineArt;
class CleffaArt extends cleffa_1.Cleffa {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UNB/UNB_131_R_EN.png';
    }
}
exports.CleffaArt = CleffaArt;
class MewArt extends mew_1.Mew {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UNB/UNB_076_R_EN_LG.png';
    }
}
exports.MewArt = MewArt;
class Pokegear30Art extends pokegear_30_1.Pokegear30 {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UNB/UNB_182_R_EN.png';
    }
}
exports.Pokegear30Art = Pokegear30Art;
class PorygonZArt extends porygon_z_1.PorygonZ {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UNB/UNB_157_R_EN_LG.png';
    }
}
exports.PorygonZArt = PorygonZArt;
class VolcanionArt extends volcanion_1.Volcanion {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UNB/UNB_025_R_EN_LG.png';
    }
}
exports.VolcanionArt = VolcanionArt;
