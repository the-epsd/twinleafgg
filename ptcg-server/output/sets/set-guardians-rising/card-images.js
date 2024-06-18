"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RescueStretcherArt = exports.MimikyuArt = exports.MallowArt = exports.EnhancedHammerArt = exports.AlolanVulpixArt = void 0;
const alolan_vulpix_1 = require("./alolan-vulpix");
const enhanced_hammer_1 = require("./enhanced-hammer");
const mallow_1 = require("./mallow");
const mimikyu_1 = require("./mimikyu");
const rescue_stretcher_1 = require("./rescue-stretcher");
class AlolanVulpixArt extends alolan_vulpix_1.AlolanVulpix {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/HIF/HIF_007_R_EN.png';
    }
}
exports.AlolanVulpixArt = AlolanVulpixArt;
class EnhancedHammerArt extends enhanced_hammer_1.EnhancedHammer {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/GRI/GRI_124_R_EN_LG.png';
    }
}
exports.EnhancedHammerArt = EnhancedHammerArt;
class MallowArt extends mallow_1.Mallow {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/GRI/GRI_127_R_EN_LG.png';
    }
}
exports.MallowArt = MallowArt;
class MimikyuArt extends mimikyu_1.Mimikyu {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/GRI/GRI_058_R_EN_LG.png';
    }
}
exports.MimikyuArt = MimikyuArt;
class RescueStretcherArt extends rescue_stretcher_1.RescueStretcher {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/GRI/GRI_130_R_EN_LG.png';
    }
}
exports.RescueStretcherArt = RescueStretcherArt;
