"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TornadusArt = exports.MaxPotionArt = exports.CrushingHammerArt = exports.CherenArt = exports.BiancaArt = void 0;
const bianca_1 = require("./bianca");
const cheren_1 = require("./cheren");
const crushing_hammer_1 = require("./crushing-hammer");
const max_potion_1 = require("./max-potion");
const tornadus_1 = require("./tornadus");
class BiancaArt extends bianca_1.Bianca {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EPO/EPO_090_R_EN.png';
    }
}
exports.BiancaArt = BiancaArt;
class CherenArt extends cheren_1.Cheren {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EPO/EPO_091_R_EN.png';
    }
}
exports.CherenArt = CherenArt;
class CrushingHammerArt extends crushing_hammer_1.CrushingHammer {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EPO/EPO_092_R_EN.png';
    }
}
exports.CrushingHammerArt = CrushingHammerArt;
class MaxPotionArt extends max_potion_1.MaxPotion {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EPO/EPO_094_R_EN.png';
    }
}
exports.MaxPotionArt = MaxPotionArt;
class TornadusArt extends tornadus_1.Tornadus {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/EPO/EPO_089_R_EN.png';
    }
}
exports.TornadusArt = TornadusArt;
