"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishfulBatonArt = exports.GuzmaArt = void 0;
const guzma_1 = require("./guzma");
const wishful_baton_1 = require("./wishful-baton");
class GuzmaArt extends guzma_1.Guzma {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_115_R_EN_LG.png';
    }
}
exports.GuzmaArt = GuzmaArt;
class WishfulBatonArt extends wishful_baton_1.WishfulBaton {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_128_R_EN_LG.png';
    }
}
exports.WishfulBatonArt = WishfulBatonArt;
