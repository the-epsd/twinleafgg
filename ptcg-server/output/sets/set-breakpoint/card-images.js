"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaryuArt = exports.PhantumpArt = exports.KricketotArt = exports.DelinquentArt = exports.BayleefArt = void 0;
const bayleef_1 = require("./bayleef");
const delinquent_1 = require("./delinquent");
const kricketot_1 = require("./kricketot");
const phantump_1 = require("./phantump");
const staryu_1 = require("./staryu");
class BayleefArt extends bayleef_1.Bayleef {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_002_R_EN_LG.png';
    }
}
exports.BayleefArt = BayleefArt;
class DelinquentArt extends delinquent_1.Delinquent {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_098_R_EN_LG.png';
    }
}
exports.DelinquentArt = DelinquentArt;
class KricketotArt extends kricketot_1.Kricketot {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_005_R_EN_LG.png';
    }
}
exports.KricketotArt = KricketotArt;
class PhantumpArt extends phantump_1.Phantump {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_064_R_EN_LG.png';
    }
}
exports.PhantumpArt = PhantumpArt;
class StaryuArt extends staryu_1.Staryu {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_025_R_EN_LG.png';
    }
}
exports.StaryuArt = StaryuArt;
