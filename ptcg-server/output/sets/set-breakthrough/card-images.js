"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParallelCityArt = exports.OctilleryArt = exports.FlorgesArt = exports.TownMapArt = exports.MagnetonArt = exports.BuddyBuddyRescueArt = exports.BrigetteArt = void 0;
const magneton_1 = require("./magneton");
const brigette_1 = require("./brigette");
const buddy_buddy_rescue_1 = require("./buddy-buddy-rescue");
const florges_1 = require("./florges");
const octillery_1 = require("./octillery");
const parallel_city_1 = require("./parallel-city");
const town_map_1 = require("./town-map");
class BrigetteArt extends brigette_1.Brigette {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKT/BKT_134_R_EN_LG.png';
    }
}
exports.BrigetteArt = BrigetteArt;
class BuddyBuddyRescueArt extends buddy_buddy_rescue_1.BuddyBuddyRescue {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKT/BKT_135_R_EN_LG.png';
    }
}
exports.BuddyBuddyRescueArt = BuddyBuddyRescueArt;
class MagnetonArt extends magneton_1.Magneton {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKT/BKT_053_R_EN_LG.png';
    }
}
exports.MagnetonArt = MagnetonArt;
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
class ParallelCityArt extends parallel_city_1.ParallelCity {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKT/BKT_145_R_EN_LG.png';
    }
}
exports.ParallelCityArt = ParallelCityArt;
