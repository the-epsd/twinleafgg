"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TropicalBeachArt = exports.LitwickArt = exports.KyuremArt = void 0;
const litwick_1 = require("./litwick");
const kyurem_1 = require("./kyurem");
const tropical_beach_1 = require("./tropical-beach");
class KyuremArt extends kyurem_1.Kyurem {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BWP/BWP_044_R_EN_LG.png';
    }
}
exports.KyuremArt = KyuremArt;
class LitwickArt extends litwick_1.Litwick {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BWP/BWP_027_R_EN_LG.png';
    }
}
exports.LitwickArt = LitwickArt;
class TropicalBeachArt extends tropical_beach_1.TropicalBeach {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BWP/BWP_028_R_EN_LG.png';
    }
}
exports.TropicalBeachArt = TropicalBeachArt;
