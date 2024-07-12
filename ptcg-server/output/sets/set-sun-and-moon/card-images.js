"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerBallArt = exports.RareCandyArt = exports.RainbowEnergyArt = exports.ProfessorKukuiArt = exports.OranguruArt = exports.NestBallArt = exports.HerdierArt = exports.GolduckArt = exports.ExpShareArt = exports.EnergyRetrievalArt = exports.DragonairArt = exports.AlolanRattataArt = void 0;
const energy_retrieval_1 = require("../set-scarlet-and-violet/energy-retrieval");
const exp_share_1 = require("../set-scarlet-and-violet/exp-share");
const nest_ball_1 = require("../set-scarlet-and-violet/nest-ball");
const rare_candy_1 = require("../set-scarlet-and-violet/rare-candy");
const dragonair_1 = require("./dragonair");
const herdier_1 = require("./herdier");
const oranguru_1 = require("./oranguru");
const professor_kukui_1 = require("./professor-kukui");
const rainbow_energy_1 = require("./rainbow-energy");
const SUM_29_Golduck_1 = require("./SUM_29_Golduck");
const SUM_76_Alolan_Rattata_1 = require("./SUM_76_Alolan_Rattata");
const timer_ball_1 = require("./timer-ball");
class AlolanRattataArt extends SUM_76_Alolan_Rattata_1.AlolanRattata {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_076_R_EN_LG.png';
    }
}
exports.AlolanRattataArt = AlolanRattataArt;
class DragonairArt extends dragonair_1.Dragonair {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_095_R_EN.png';
    }
}
exports.DragonairArt = DragonairArt;
class EnergyRetrievalArt extends energy_retrieval_1.EnergyRetrieval {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_116_R_EN.png';
        this.setNumber = '116';
        this.fullName = 'Energy Retrieval SUM';
    }
}
exports.EnergyRetrievalArt = EnergyRetrievalArt;
class ExpShareArt extends exp_share_1.ExpShare {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_118_R_EN.png';
        this.setNumber = '118';
        this.fullName = 'Exp. Share SUM';
    }
}
exports.ExpShareArt = ExpShareArt;
class GolduckArt extends SUM_29_Golduck_1.Golduck {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_029_R_EN_LG.png';
    }
}
exports.GolduckArt = GolduckArt;
class HerdierArt extends herdier_1.Herdier {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_104_R_EN.png';
    }
}
exports.HerdierArt = HerdierArt;
class NestBallArt extends nest_ball_1.NestBall {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_123_R_EN.png';
        this.setNumber = '123';
        this.fullName = 'Nest Ball SUM';
    }
}
exports.NestBallArt = NestBallArt;
class OranguruArt extends oranguru_1.Oranguru {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_113_R_EN_LG.png';
    }
}
exports.OranguruArt = OranguruArt;
class ProfessorKukuiArt extends professor_kukui_1.ProfessorKukui {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_128_R_EN.png';
    }
}
exports.ProfessorKukuiArt = ProfessorKukuiArt;
class RainbowEnergyArt extends rainbow_energy_1.RainbowEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_137_R_EN.png';
    }
}
exports.RainbowEnergyArt = RainbowEnergyArt;
class RareCandyArt extends rare_candy_1.RareCandy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_129_R_EN.png';
        this.setNumber = '129';
        this.fullName = 'Rare Candy SUM';
    }
}
exports.RareCandyArt = RareCandyArt;
class TimerBallArt extends timer_ball_1.TimerBall {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_134_R_EN_LG.png';
    }
}
exports.TimerBallArt = TimerBallArt;
