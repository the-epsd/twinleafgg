"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleEPO = exports.CrushingHammerEPO = void 0;
const recycle_1 = require("../set-fossil/recycle");
const crushing_hammer_1 = require("../set-scarlet-and-violet/crushing-hammer");
class CrushingHammerEPO extends crushing_hammer_1.CrushingHammer {
    constructor() {
        super(...arguments);
        this.set = 'EPO';
        this.setNumber = '92';
        this.fullName = 'Crushing Hammer EPO';
    }
}
exports.CrushingHammerEPO = CrushingHammerEPO;
class RecycleEPO extends recycle_1.Recycle {
    constructor() {
        super(...arguments);
        this.set = 'EPO';
        this.setNumber = '96';
        this.fullName = 'Recycle EPO';
        this.text = 'Flip a coin. If heads, put a card from your discard pile on top of your deck.';
    }
}
exports.RecycleEPO = RecycleEPO;
