"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuKokoArt = exports.PikachuZekromGXArt = exports.PalaceBookArt = exports.LurantisArt = exports.FirefighterPikachuArt = void 0;
const firefighter_pikachu_1 = require("./firefighter-pikachu");
const palace_book_1 = require("./palace-book");
const pikachu_and_zekrom_gx_1 = require("./pikachu-and-zekrom-gx");
const lurantis_1 = require("./lurantis");
const tapu_koko_1 = require("./tapu-koko");
class FirefighterPikachuArt extends firefighter_pikachu_1.FirefighterPikachu {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpc/SMP/SMP_209_R_JP.png';
    }
}
exports.FirefighterPikachuArt = FirefighterPikachuArt;
class LurantisArt extends lurantis_1.Lurantis {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SMP/SMP_025_R_EN_LG.png';
    }
}
exports.LurantisArt = LurantisArt;
class PalaceBookArt extends palace_book_1.PalaceBook {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpc/SMP/SMP_NAN25_R_JP_LG.png';
    }
}
exports.PalaceBookArt = PalaceBookArt;
class PikachuZekromGXArt extends pikachu_and_zekrom_gx_1.PikachuZekromGX {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SMP/SMP_168_R_EN_LG.png';
    }
}
exports.PikachuZekromGXArt = PikachuZekromGXArt;
class TapuKokoArt extends tapu_koko_1.TapuKoko {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SMP/SMP_030_R_EN_LG.png';
    }
}
exports.TapuKokoArt = TapuKokoArt;
