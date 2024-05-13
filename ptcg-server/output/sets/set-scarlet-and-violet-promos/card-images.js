"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MimikyuexArt = exports.CharmanderArt = exports.AnnihilapeexArt = exports.AmpharosexArt = void 0;
const ampharos_ex_1 = require("./ampharos-ex");
const annihilape_ex_1 = require("./annihilape-ex");
const charmander_1 = require("./charmander");
const mimikyu_ex_1 = require("./mimikyu-ex");
class AmpharosexArt extends ampharos_ex_1.Ampharosex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SVP/SVP_016_R_EN_LG.png';
    }
}
exports.AmpharosexArt = AmpharosexArt;
class AnnihilapeexArt extends annihilape_ex_1.Annihilapeex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SVP/SVP_032_R_EN_LG.png';
    }
}
exports.AnnihilapeexArt = AnnihilapeexArt;
class CharmanderArt extends charmander_1.Charmander {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SVP/SVP_047_R_EN_LG.png';
    }
}
exports.CharmanderArt = CharmanderArt;
class MimikyuexArt extends mimikyu_ex_1.Mimikyuex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SVP/SVP_004_R_EN_LG.png';
    }
}
exports.MimikyuexArt = MimikyuexArt;
