"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LarvestaIRArt = void 0;
const larvesta_1 = require("./larvesta");
class LarvestaIRArt extends larvesta_1.Larvesta {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SVI/SVI_203_R_EN_LG.png';
        this.setNumber = '196';
        this.fullName = 'LarvestaIR SSP';
    }
}
exports.LarvestaIRArt = LarvestaIRArt;
