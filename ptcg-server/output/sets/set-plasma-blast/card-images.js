"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirizionExArt = exports.UltraBallArt = exports.SilverBangleArt = exports.ScoopUpCycloneArt = exports.JirachiExArt = void 0;
const jirachi_ex_1 = require("./jirachi-ex");
const scoop_up_cyclone_1 = require("./scoop-up-cyclone");
const silver_bangle_1 = require("./silver-bangle");
const ultra_ball_1 = require("./ultra-ball");
const virizion_ex_1 = require("./virizion-ex");
class JirachiExArt extends jirachi_ex_1.JirachiEx {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLB/PLB_060_R_EN.png';
    }
}
exports.JirachiExArt = JirachiExArt;
class ScoopUpCycloneArt extends scoop_up_cyclone_1.ScoopUpCyclone {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLB/PLB_095_R_EN.png';
    }
}
exports.ScoopUpCycloneArt = ScoopUpCycloneArt;
class SilverBangleArt extends silver_bangle_1.SilverBangle {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLB/PLB_088_R_EN.png';
    }
}
exports.SilverBangleArt = SilverBangleArt;
class UltraBallArt extends ultra_ball_1.UltraBall {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLB/PLB_090_R_EN.png';
    }
}
exports.UltraBallArt = UltraBallArt;
class VirizionExArt extends virizion_ex_1.VirizionEx {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLB/PLB_009_R_EN.png';
    }
}
exports.VirizionExArt = VirizionExArt;
