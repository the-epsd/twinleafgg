"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedHammerGRI = exports.AlolanVulpixGRI = void 0;
const alolan_vulpix_1 = require("../set-hidden-fates/alolan-vulpix");
const enhanced_hammer_1 = require("../set-twilight-masquerade/enhanced-hammer");
class AlolanVulpixGRI extends alolan_vulpix_1.AlolanVulpix {
    constructor() {
        super(...arguments);
        this.fullName = 'Alolan Vulpix GRI';
        this.setNumber = '21';
        this.set = 'GRI';
    }
}
exports.AlolanVulpixGRI = AlolanVulpixGRI;
class EnhancedHammerGRI extends enhanced_hammer_1.EnhancedHammer {
    constructor() {
        super(...arguments);
        this.fullName = 'Enhanced Hammer GRI';
        this.setNumber = '124';
        this.set = 'GRI';
    }
}
exports.EnhancedHammerGRI = EnhancedHammerGRI;
