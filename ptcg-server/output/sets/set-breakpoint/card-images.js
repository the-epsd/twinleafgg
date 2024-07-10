"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoroarkArt = exports.SudowoodoArt = exports.StaryuArt = exports.SplashEnergyArt = exports.ReverseValleyArt = exports.PhantumpArt = exports.KricketotArt = exports.FroakieArt = exports.FightingFuryBeltArt = exports.DelinquentArt = exports.BayleefArt = void 0;
const bayleef_1 = require("./bayleef");
const BKP_38_Froakie_1 = require("./BKP_38_Froakie");
const BKP_67_Sudowoodo_1 = require("./BKP_67_Sudowoodo");
const BKT_91_Zoroark_1 = require("./BKT_91_Zoroark");
const delinquent_1 = require("./delinquent");
const fighting_fury_belt_1 = require("./fighting-fury-belt");
const kricketot_1 = require("./kricketot");
const phantump_1 = require("./phantump");
const reverse_valley_1 = require("./reverse-valley");
const splash_energy_1 = require("./splash-energy");
const staryu_1 = require("./staryu");
class BayleefArt extends bayleef_1.Bayleef {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_002_R_EN_LG.png';
    }
}
exports.BayleefArt = BayleefArt;
class DelinquentArt extends delinquent_1.Delinquent {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_098_R_EN_LG.png';
    }
}
exports.DelinquentArt = DelinquentArt;
class FightingFuryBeltArt extends fighting_fury_belt_1.FightingFuryBelt {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_099_R_EN_LG.png';
    }
}
exports.FightingFuryBeltArt = FightingFuryBeltArt;
class FroakieArt extends BKP_38_Froakie_1.Froakie {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_038_R_EN_LG.png';
    }
}
exports.FroakieArt = FroakieArt;
class KricketotArt extends kricketot_1.Kricketot {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_005_R_EN_LG.png';
    }
}
exports.KricketotArt = KricketotArt;
class PhantumpArt extends phantump_1.Phantump {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_064_R_EN_LG.png';
    }
}
exports.PhantumpArt = PhantumpArt;
class ReverseValleyArt extends reverse_valley_1.ReverseValley {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_110_R_EN_LG.png';
    }
}
exports.ReverseValleyArt = ReverseValleyArt;
class SplashEnergyArt extends splash_energy_1.SplashEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_113_R_EN_LG.png';
    }
}
exports.SplashEnergyArt = SplashEnergyArt;
class StaryuArt extends staryu_1.Staryu {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_025_R_EN_LG.png';
    }
}
exports.StaryuArt = StaryuArt;
class SudowoodoArt extends BKP_67_Sudowoodo_1.Sudowoodo {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKP/BKP_067_R_EN_LG.png';
    }
}
exports.SudowoodoArt = SudowoodoArt;
class ZoroarkArt extends BKT_91_Zoroark_1.Zoroark {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/BKT/BKT_091_R_EN_LG.png';
    }
}
exports.ZoroarkArt = ZoroarkArt;
