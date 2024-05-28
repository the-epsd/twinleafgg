"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnorlaxArt = exports.RaikouArt = exports.LeonArt = exports.CharmeleonArt = exports.CharmanderArt = exports.CharizardArt = void 0;
const charizard_1 = require("./charizard");
const charmander_1 = require("./charmander");
const charmeleon_1 = require("./charmeleon");
const leon_1 = require("./leon");
const raikou_1 = require("./raikou");
const snorlax_1 = require("./snorlax");
class CharizardArt extends charizard_1.Charizard {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/VIV/VIV_025_R_EN.png';
    }
}
exports.CharizardArt = CharizardArt;
class CharmanderArt extends charmander_1.Charmander {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/VIV/VIV_023_R_EN.png';
    }
}
exports.CharmanderArt = CharmanderArt;
class CharmeleonArt extends charmeleon_1.Charmeleon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/VIV/VIV_024_R_EN.png';
    }
}
exports.CharmeleonArt = CharmeleonArt;
class LeonArt extends leon_1.Leon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/VIV/VIV_154_R_EN.png';
    }
}
exports.LeonArt = LeonArt;
class RaikouArt extends raikou_1.Raikou {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/VIV/VIV_050_R_EN.png';
    }
}
exports.RaikouArt = RaikouArt;
class SnorlaxArt extends snorlax_1.Snorlax {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/VIV/VIV_131_R_EN.png';
    }
}
exports.SnorlaxArt = SnorlaxArt;
