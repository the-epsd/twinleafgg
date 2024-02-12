"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShuckleArt = void 0;
const shuckle_1 = require("./shuckle");
class ShuckleArt extends shuckle_1.Shuckle {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/HS/HS_023_R_EN.png';
    }
}
exports.ShuckleArt = ShuckleArt;
