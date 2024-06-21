"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysteriousTreasureArt = exports.MalamarArt = exports.InkayArt = void 0;
const inkay_1 = require("./inkay");
const malamar_1 = require("./malamar");
const mysterious_treasure_1 = require("./mysterious-treasure");
class InkayArt extends inkay_1.Inkay {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLI/FLI_050_R_EN_LG.png';
    }
}
exports.InkayArt = InkayArt;
class MalamarArt extends malamar_1.Malamar {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLI/FLI_051_R_EN_LG.png';
    }
}
exports.MalamarArt = MalamarArt;
class MysteriousTreasureArt extends mysterious_treasure_1.MysteriousTreasure {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLI/FLI_113_R_EN_LG.png';
    }
}
exports.MysteriousTreasureArt = MysteriousTreasureArt;
