"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MewtwoArt = void 0;
const mewtwo_1 = require("./mewtwo");
class MewtwoArt extends mewtwo_1.Mewtwo {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BRS/BRS_096_R_EN_LG.png';
    }
}
exports.MewtwoArt = MewtwoArt;
