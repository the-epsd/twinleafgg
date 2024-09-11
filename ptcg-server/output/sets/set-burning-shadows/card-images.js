"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishfulBatonArt = exports.PlumeriaArt = exports.MarillArt = exports.GuzmaArt = exports.GloomArt = exports.DarkraiGXArt = exports.AcerolaArt = void 0;
const acerola_1 = require("./acerola");
const BUS_34_Marill_1 = require("./BUS_34_Marill");
const darkrai_gx_1 = require("./darkrai-gx");
const gloom_1 = require("./gloom");
const guzma_1 = require("./guzma");
const plumeria_1 = require("./plumeria");
const wishful_baton_1 = require("./wishful-baton");
class AcerolaArt extends acerola_1.Acerola {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_112_R_EN_LG.png';
    }
}
exports.AcerolaArt = AcerolaArt;
class DarkraiGXArt extends darkrai_gx_1.DarkraiGX {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_088_R_EN.png';
    }
}
exports.DarkraiGXArt = DarkraiGXArt;
class GloomArt extends gloom_1.Gloom {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_005_R_EN.png';
    }
}
exports.GloomArt = GloomArt;
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
class PlumeriaArt extends plumeria_1.Plumeria {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_120_R_EN_LG.png';
    }
}
exports.PlumeriaArt = PlumeriaArt;
class WishfulBatonArt extends wishful_baton_1.WishfulBaton {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BUS/BUS_128_R_EN_LG.png';
    }
}
exports.WishfulBatonArt = WishfulBatonArt;
