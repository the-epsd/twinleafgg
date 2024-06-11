"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZebstrikaArt = exports.WurmpleArt = exports.TreeckoArt = exports.NihilegoArt = exports.MeganiumArt = exports.GrovleArt = exports.ChikoritaArt = void 0;
const wurmple_1 = require("./wurmple");
const chikorita_1 = require("./chikorita");
const grovyle_1 = require("./grovyle");
const treecko_1 = require("./treecko");
const zebstrika_1 = require("./zebstrika");
const meganium_1 = require("./meganium");
const nihilego_1 = require("./nihilego");
class ChikoritaArt extends chikorita_1.Chikorita {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LOT/LOT_006_R_EN_LG.png';
    }
}
exports.ChikoritaArt = ChikoritaArt;
class GrovleArt extends grovyle_1.Grovyle {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LOT/LOT_021_R_EN_LG.png';
    }
}
exports.GrovleArt = GrovleArt;
class MeganiumArt extends meganium_1.Meganium {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LOT/LOT_008_R_EN_LG.png';
    }
}
exports.MeganiumArt = MeganiumArt;
class NihilegoArt extends nihilego_1.Nihilego {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LOT/LOT_106_R_EN_LG.png';
    }
}
exports.NihilegoArt = NihilegoArt;
class TreeckoArt extends treecko_1.Treecko {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LOT/LOT_020_R_EN_LG.png';
    }
}
exports.TreeckoArt = TreeckoArt;
class WurmpleArt extends wurmple_1.Wurmple {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LOT/LOT_024_R_EN_LG.png';
    }
}
exports.WurmpleArt = WurmpleArt;
class ZebstrikaArt extends zebstrika_1.Zebstrika {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LOT/LOT_082_R_EN_LG.png';
    }
}
exports.ZebstrikaArt = ZebstrikaArt;
