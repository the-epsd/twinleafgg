"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharmanderArt = void 0;
const charmander_1 = require("./charmander");
class CharmanderArt extends charmander_1.Charmander {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/HIF/HIF_007_R_EN.png';
    }
}
exports.CharmanderArt = CharmanderArt;
