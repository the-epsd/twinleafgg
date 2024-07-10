"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitEnergyFDYArt = exports.MysteriousTreasureArt = exports.MetalFryingPanArt = exports.MalamarArt = exports.MagnezoneArt = exports.InkayArt = exports.FrogadierArt = exports.BeastRingArt = void 0;
const beast_ring_1 = require("./beast-ring");
const FLI_23_Frogadier_1 = require("./FLI_23_Frogadier");
const FLI_36_Magnezone_1 = require("./FLI_36_Magnezone");
const inkay_1 = require("./inkay");
const malamar_1 = require("./malamar");
const metal_frying_pan_1 = require("./metal-frying-pan");
const mysterious_treasure_1 = require("./mysterious-treasure");
const unit_energy_fdy_1 = require("./unit-energy-fdy");
class BeastRingArt extends beast_ring_1.BeastRing {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLI/FLI_102_R_EN_LG.png';
    }
}
exports.BeastRingArt = BeastRingArt;
class FrogadierArt extends FLI_23_Frogadier_1.Frogadier {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLI/FLI_023_R_EN_LG.png';
    }
}
exports.FrogadierArt = FrogadierArt;
class InkayArt extends inkay_1.Inkay {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLI/FLI_050_R_EN_LG.png';
    }
}
exports.InkayArt = InkayArt;
class MagnezoneArt extends FLI_36_Magnezone_1.Magnezone {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLI/FLI_036_R_EN_LG.png';
    }
}
exports.MagnezoneArt = MagnezoneArt;
class MalamarArt extends malamar_1.Malamar {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLI/FLI_051_R_EN_LG.png';
    }
}
exports.MalamarArt = MalamarArt;
class MetalFryingPanArt extends metal_frying_pan_1.MetalFryingPan {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLI/FLI_112_R_EN_LG.png';
    }
}
exports.MetalFryingPanArt = MetalFryingPanArt;
class MysteriousTreasureArt extends mysterious_treasure_1.MysteriousTreasure {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLI/FLI_113_R_EN_LG.png';
    }
}
exports.MysteriousTreasureArt = MysteriousTreasureArt;
class UnitEnergyFDYArt extends unit_energy_fdy_1.UnitEnergyFDY {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLI/FLI_118_R_EN.png';
    }
}
exports.UnitEnergyFDYArt = UnitEnergyFDYArt;
