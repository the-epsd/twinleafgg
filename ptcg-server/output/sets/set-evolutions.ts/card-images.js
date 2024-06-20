"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarmieArt = exports.DevolutionSprayArt = void 0;
const devolution_spray_1 = require("../set-base-set/devolution-spray");
const starmie_1 = require("./starmie");
class DevolutionSprayArt extends devolution_spray_1.DevolutionSpray {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_076_R_EN_LG.png';
    }
}
exports.DevolutionSprayArt = DevolutionSprayArt;
class StarmieArt extends starmie_1.Starmie {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_031_R_EN_LG.png';
    }
}
exports.StarmieArt = StarmieArt;
