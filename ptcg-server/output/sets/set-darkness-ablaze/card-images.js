"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuKokoArt = exports.LugiaArt = exports.KangaskhanArt = exports.BirdKeeperArt = void 0;
const bird_keeper_1 = require("./bird-keeper");
const kangaskhan_1 = require("./kangaskhan");
const lugia_1 = require("./lugia");
const tapu_koko_1 = require("./tapu-koko");
class BirdKeeperArt extends bird_keeper_1.BirdKeeper {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_159_R_EN_LG.png';
    }
}
exports.BirdKeeperArt = BirdKeeperArt;
class KangaskhanArt extends kangaskhan_1.Kangaskhan {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_133_R_EN_LG.png';
    }
}
exports.KangaskhanArt = KangaskhanArt;
class LugiaArt extends lugia_1.Lugia {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_140_R_EN_LG.png';
    }
}
exports.LugiaArt = LugiaArt;
class TapuKokoArt extends tapu_koko_1.TapuKoko {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DAA/DAA_061_R_EN_LG.png';
    }
}
exports.TapuKokoArt = TapuKokoArt;
