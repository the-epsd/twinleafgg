"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerBallArt = exports.RepelArt = exports.RareCandyArt = exports.RainbowEnergyArt = exports.ProfessorKukuiArt = exports.OranguruArt = exports.NestBallArt = exports.HerdierArt = exports.GolduckArt = exports.FomantisArt = exports.ExpShareArt = exports.EnergyRetrievalArt = exports.DragonairArt = exports.AlolanRattataArt = exports.AlolanMukArt = exports.AlolanGrimerArt = void 0;
const energy_retrieval_1 = require("../set-scarlet-and-violet/energy-retrieval");
const exp_share_1 = require("../set-scarlet-and-violet/exp-share");
const nest_ball_1 = require("../set-scarlet-and-violet/nest-ball");
const rare_candy_1 = require("../set-scarlet-and-violet/rare-candy");
const alolan_grimer_1 = require("./alolan-grimer");
const alolan_muk_1 = require("./alolan-muk");
const dragonair_1 = require("./dragonair");
const herdier_1 = require("./herdier");
const oranguru_1 = require("./oranguru");
const professor_kukui_1 = require("./professor-kukui");
const rainbow_energy_1 = require("./rainbow-energy");
const repel_1 = require("./repel");
const fomantis_1 = require("./fomantis");
const golduck_1 = require("./golduck");
const alolan_rattata_1 = require("./alolan_rattata");
const timer_ball_1 = require("./timer-ball");
class AlolanGrimerArt extends alolan_grimer_1.AlolanGrimer {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_057_R_EN_LG.png';
    }
}
exports.AlolanGrimerArt = AlolanGrimerArt;
class AlolanMukArt extends alolan_muk_1.AlolanMuk {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_058_R_EN_LG.png';
    }
}
exports.AlolanMukArt = AlolanMukArt;
class AlolanRattataArt extends alolan_rattata_1.AlolanRattata {
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
class FomantisArt extends fomantis_1.Fomantis {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_014_R_EN_LG.png';
    }
}
exports.FomantisArt = FomantisArt;
class GolduckArt extends golduck_1.Golduck {
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
class RepelArt extends repel_1.Repel {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_130_R_EN.png';
    }
}
exports.RepelArt = RepelArt;
class TimerBallArt extends timer_ball_1.TimerBall {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_134_R_EN_LG.png';
    }
}
exports.TimerBallArt = TimerBallArt;
