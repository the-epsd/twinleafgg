"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnorlaxSVP = exports.PawmotSVP = void 0;
const snorlax_1 = require("../set-pokemon-151/snorlax");
const pawmot_1 = require("../set-scarlet-and-violet/pawmot");
class PawmotSVP extends pawmot_1.Pawmot {
    constructor() {
        super(...arguments);
        this.setNumber = '6';
        this.fullName = 'Pawmot SVP';
        this.set = 'SVP';
    }
}
exports.PawmotSVP = PawmotSVP;
class SnorlaxSVP extends snorlax_1.Snorlax {
    constructor() {
        super(...arguments);
        this.setNumber = '51';
        this.fullName = 'Snorlax SVP';
        this.set = 'SVP';
    }
}
exports.SnorlaxSVP = SnorlaxSVP;
