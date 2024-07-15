"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishfulBatonArt = exports.MarillArt = exports.GuzmaArt = exports.AcerolaArt = void 0;
const acerola_1 = require("./acerola");
const BUS_34_Marill_1 = require("./BUS_34_Marill");
const guzma_1 = require("./guzma");
const wishful_baton_1 = require("./wishful-baton");
class AcerolaArt extends acerola_1.Acerola {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_112_R_EN_LG.png';
    }
}
exports.AcerolaArt = AcerolaArt;
class GuzmaArt extends guzma_1.Guzma {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_115_R_EN_LG.png';
    }
}
exports.GuzmaArt = GuzmaArt;
class MarillArt extends BUS_34_Marill_1.Marill {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_034_R_EN_LG.png';
    }
}
exports.MarillArt = MarillArt;
class WishfulBatonArt extends wishful_baton_1.WishfulBaton {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_128_R_EN_LG.png';
    }
}
exports.WishfulBatonArt = WishfulBatonArt;
