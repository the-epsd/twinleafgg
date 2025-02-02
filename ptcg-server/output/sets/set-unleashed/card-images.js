"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShayminArt = exports.DualBallArt = void 0;
const dual_ball_1 = require("./dual-ball");
const shaymin_1 = require("./shaymin");
class DualBallArt extends dual_ball_1.DualBall {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UL/UL_072_R_EN.png';
    }
}
exports.DualBallArt = DualBallArt;
class ShayminArt extends shaymin_1.Shaymin {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UL/UL_008_R_EN.png';
    }
}
exports.ShayminArt = ShayminArt;
