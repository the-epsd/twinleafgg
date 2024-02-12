"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TownMapArt = void 0;
const town_map_1 = require("./town-map");
class TownMapArt extends town_map_1.TownMap {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKT/BKT_150_R_EN.png';
    }
}
exports.TownMapArt = TownMapArt;
