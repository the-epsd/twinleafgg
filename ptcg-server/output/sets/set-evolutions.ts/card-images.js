"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarmieArt = void 0;
const starmie_1 = require("./starmie");
class StarmieArt extends starmie_1.Starmie {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EVO/EVO_031_R_EN_LG.png';
    }
}
exports.StarmieArt = StarmieArt;
