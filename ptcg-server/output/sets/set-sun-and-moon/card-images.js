"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RareCandyArt = exports.RainbowEnergyArt = exports.NestBallArt = exports.ExpShareArt = exports.EnergyRetrievalArt = void 0;
const energy_retrieval_1 = require("./energy-retrieval");
const exp_share_1 = require("./exp-share");
const nest_ball_1 = require("./nest-ball");
const rainbow_energy_1 = require("./rainbow-energy");
const rare_candy_1 = require("./rare-candy");
class EnergyRetrievalArt extends energy_retrieval_1.EnergyRetrieval {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_116_R_EN.png';
    }
}
exports.EnergyRetrievalArt = EnergyRetrievalArt;
class ExpShareArt extends exp_share_1.ExpShare {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_118_R_EN.png';
    }
}
exports.ExpShareArt = ExpShareArt;
class NestBallArt extends nest_ball_1.NestBall {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SUM/SUM_123_R_EN.png';
    }
}
exports.NestBallArt = NestBallArt;
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
    }
}
exports.RareCandyArt = RareCandyArt;
