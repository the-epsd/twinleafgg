"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnownArt = void 0;
const unown_1 = require("./unown");
class UnownArt extends unown_1.Unown {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/AOR/AOR_030_R_EN.png';
    }
}
exports.UnownArt = UnownArt;
