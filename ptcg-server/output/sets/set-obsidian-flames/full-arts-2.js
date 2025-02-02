"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharizardexFA = void 0;
const charizard_ex_1 = require("./charizard-ex");
class CharizardexFA extends charizard_ex_1.Charizardex {
    constructor() {
        super(...arguments);
        this.set2 = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpc/SV3/SV3_125_R_JP_LG.png';
    }
    getScanUrl(card) {
        return this.getScanUrl(card)
            .replace('https://www.serebii.net/card', 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpc');
    }
}
exports.CharizardexFA = CharizardexFA;
