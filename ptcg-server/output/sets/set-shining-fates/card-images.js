"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrosmothArt = void 0;
const frosmoth_1 = require("./frosmoth");
class FrosmothArt extends frosmoth_1.Frosmoth {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SHF/SHF_030_R_EN_LG.png';
    }
}
exports.FrosmothArt = FrosmothArt;
