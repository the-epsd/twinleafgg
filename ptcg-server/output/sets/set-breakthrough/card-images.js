"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OctilleryArt = exports.FlorgesArt = exports.TownMapArt = void 0;
const florges_1 = require("./florges");
const octillery_1 = require("./octillery");
const town_map_1 = require("./town-map");
class TownMapArt extends town_map_1.TownMap {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKT/BKT_150_R_EN.png';
    }
}
exports.TownMapArt = TownMapArt;
class FlorgesArt extends florges_1.Florges {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKT/BKT_103_R_EN_LG.png';
    }
}
exports.FlorgesArt = FlorgesArt;
class OctilleryArt extends octillery_1.Octillery {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKT/BKT_033_R_EN_LG.png';
    }
}
exports.OctilleryArt = OctilleryArt;
