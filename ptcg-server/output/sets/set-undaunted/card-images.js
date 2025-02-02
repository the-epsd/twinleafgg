"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VileplumeArt = exports.SmeargleArt = exports.RotomArt = exports.OddishArt = exports.MetalEnergySpecialArt = exports.GloomArt = exports.FlowerShopLadyArt = exports.DarknessEnergySpecialArt = void 0;
const darkness_energy_special_1 = require("./darkness-energy-special");
const flower_shop_lady_1 = require("./flower-shop-lady");
const gloom_1 = require("./gloom");
const metal_energy_special_1 = require("./metal-energy-special");
const oddish_1 = require("./oddish");
const rotom_1 = require("./rotom");
const smeargle_1 = require("./smeargle");
const vileplume_1 = require("./vileplume");
class DarknessEnergySpecialArt extends darkness_energy_special_1.DarknessEnergySpecial {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UD/UD_079_R_EN.png';
    }
}
exports.DarknessEnergySpecialArt = DarknessEnergySpecialArt;
class FlowerShopLadyArt extends flower_shop_lady_1.FlowerShopLady {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UD/UD_074_R_EN.png';
    }
}
exports.FlowerShopLadyArt = FlowerShopLadyArt;
class GloomArt extends gloom_1.Gloom {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UD/UD_027_R_EN.png';
    }
}
exports.GloomArt = GloomArt;
class MetalEnergySpecialArt extends metal_energy_special_1.MetalEnergySpecial {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UD/UD_080_R_EN.png';
    }
}
exports.MetalEnergySpecialArt = MetalEnergySpecialArt;
class OddishArt extends oddish_1.Oddish {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UD/UD_060_R_EN.png';
    }
}
exports.OddishArt = OddishArt;
class RotomArt extends rotom_1.Rotom {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UD/UD_020_R_EN.png';
    }
}
exports.RotomArt = RotomArt;
class SmeargleArt extends smeargle_1.Smeargle {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UD/UD_008_R_EN.png';
    }
}
exports.SmeargleArt = SmeargleArt;
class VileplumeArt extends vileplume_1.Vileplume {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UD/UD_024_R_EN.png';
    }
}
exports.VileplumeArt = VileplumeArt;
