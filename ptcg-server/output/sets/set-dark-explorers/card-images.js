"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedHammerDEX = exports.DarkPatchDEX = void 0;
const dark_patch_1 = require("../set-astral-radiance/dark-patch");
const enhanced_hammer_1 = require("../set-twilight-masquerade/enhanced-hammer");
class DarkPatchDEX extends dark_patch_1.DarkPatch {
    constructor() {
        super(...arguments);
        this.setNumber = '93';
        this.fullName = 'Dark Patch DEX';
        this.set = 'DEX';
    }
}
exports.DarkPatchDEX = DarkPatchDEX;
class EnhancedHammerDEX extends enhanced_hammer_1.EnhancedHammer {
    constructor() {
        super(...arguments);
        this.setNumber = '94';
        this.fullName = 'Enhanced Hammer DEX';
        this.set = 'DEX';
    }
}
exports.EnhancedHammerDEX = EnhancedHammerDEX;
