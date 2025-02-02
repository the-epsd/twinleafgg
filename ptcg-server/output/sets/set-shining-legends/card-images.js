"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoroarkGXArt = exports.WarpEnergyArt = exports.VenusaurArt = exports.ShiningMewArt = exports.ShiningGenesectArt = exports.PlusleArt = exports.MarshadowArt = exports.CroconawArt = void 0;
const croconaw_1 = require("./croconaw");
const marshadow_1 = require("./marshadow");
const plusle_1 = require("./plusle");
const shining_genesect_1 = require("./shining-genesect");
const shining_mew_1 = require("./shining-mew");
const venusaur_1 = require("./venusaur");
const warp_energy_1 = require("./warp-energy");
const zoroark_gx_1 = require("./zoroark-gx");
class CroconawArt extends croconaw_1.Croconaw {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SLG/SLG_019_R_EN_LG.png';
    }
}
exports.CroconawArt = CroconawArt;
class MarshadowArt extends marshadow_1.Marshadow {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SLG/SLG_045_R_EN.png';
    }
}
exports.MarshadowArt = MarshadowArt;
class PlusleArt extends plusle_1.Plusle {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SLG/SLG_033_R_EN_LG.png';
    }
}
exports.PlusleArt = PlusleArt;
class ShiningGenesectArt extends shining_genesect_1.ShiningGenesect {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SLG/SLG_009_R_EN.png';
    }
}
exports.ShiningGenesectArt = ShiningGenesectArt;
class ShiningMewArt extends shining_mew_1.ShiningMew {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SLG/SLG_040_R_EN_LG.png';
    }
}
exports.ShiningMewArt = ShiningMewArt;
class VenusaurArt extends venusaur_1.Venusaur {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SLG/SLG_003_R_EN_LG.png';
    }
}
exports.VenusaurArt = VenusaurArt;
class WarpEnergyArt extends warp_energy_1.WarpEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SLG/SLG_070_R_EN.png';
    }
}
exports.WarpEnergyArt = WarpEnergyArt;
class ZoroarkGXArt extends zoroark_gx_1.ZoroarkGX {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SLG/SLG_053_R_EN.png';
    }
}
exports.ZoroarkGXArt = ZoroarkGXArt;
