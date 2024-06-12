"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoalossalArt = void 0;
const coalossal_1 = require("./coalossal");
class CoalossalArt extends coalossal_1.Coalossal {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/RCL/RCL_107_R_EN_LG.png';
    }
}
exports.CoalossalArt = CoalossalArt;
