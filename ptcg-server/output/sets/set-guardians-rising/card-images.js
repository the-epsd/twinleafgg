"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedHammerArt = exports.AlolanVulpixArt = void 0;
const alolan_vulpix_1 = require("./alolan-vulpix");
const enhanced_hammer_1 = require("./enhanced-hammer");
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
