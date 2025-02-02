"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TropicalBeachBWP50 = void 0;
const tropical_beach_1 = require("./tropical-beach");
class TropicalBeachBWP50 extends tropical_beach_1.TropicalBeach {
    constructor() {
        super(...arguments);
        this.fullName = 'Tropical Beach BWP50';
        this.set = 'BWP';
        this.setNumber = '50';
    }
}
exports.TropicalBeachBWP50 = TropicalBeachBWP50;
