"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThwackeyArt = exports.RillaboomArt = exports.FrosmothArt = void 0;
const frosmoth_1 = require("./frosmoth");
const rillaboom_1 = require("./rillaboom");
const thwackey_1 = require("./thwackey");
class FrosmothArt extends frosmoth_1.Frosmoth {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SHF/SHF_030_R_EN_LG.png';
    }
}
exports.FrosmothArt = FrosmothArt;
class RillaboomArt extends rillaboom_1.Rillaboom {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SHF/SHF_SV6_R_EN_LG.png';
    }
}
exports.RillaboomArt = RillaboomArt;
class ThwackeyArt extends thwackey_1.Thwackey {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SHF/SHF_SV5_R_EN_LG.png';
    }
}
exports.ThwackeyArt = ThwackeyArt;
