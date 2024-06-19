"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThwackeyArt = exports.RillaboomArt = exports.KoffingArt = exports.FrosmothArt = exports.BallGuyArt = void 0;
const ball_guy_1 = require("./ball-guy");
const frosmoth_1 = require("./frosmoth");
const koffing_1 = require("./koffing");
const rillaboom_1 = require("./rillaboom");
const thwackey_1 = require("./thwackey");
class BallGuyArt extends ball_guy_1.BallGuy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SHF/SHF_057_R_EN_LG.png';
    }
}
exports.BallGuyArt = BallGuyArt;
class FrosmothArt extends frosmoth_1.Frosmoth {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SHF/SHF_030_R_EN_LG.png';
    }
}
exports.FrosmothArt = FrosmothArt;
class KoffingArt extends koffing_1.Koffing {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SHF/SHF_041_R_EN_LG.png';
    }
}
exports.KoffingArt = KoffingArt;
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
