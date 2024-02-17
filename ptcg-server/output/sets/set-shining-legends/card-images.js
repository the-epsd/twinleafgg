"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarshadowArt = void 0;
const marshadow_1 = require("./marshadow");
class MarshadowArt extends marshadow_1.Marshadow {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SLG/SLG_045_R_EN.png';
    }
}
exports.MarshadowArt = MarshadowArt;
