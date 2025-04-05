"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotomDexSR = exports.RareCandySUM = exports.NestBallSUM = exports.ExpShareSUM = exports.EnergyRetrievalSUM = void 0;
const energy_retrieval_1 = require("../set-scarlet-and-violet/energy-retrieval");
const exp_share_1 = require("../set-scarlet-and-violet/exp-share");
const nest_ball_1 = require("../set-scarlet-and-violet/nest-ball");
const rare_candy_1 = require("../set-scarlet-and-violet/rare-candy");
const rotom_dex_1 = require("./rotom-dex");
class EnergyRetrievalSUM extends energy_retrieval_1.EnergyRetrieval {
    constructor() {
        super(...arguments);
        this.setNumber = '116';
        this.fullName = 'Energy Retrieval SUM';
        this.set = 'SUM';
    }
}
exports.EnergyRetrievalSUM = EnergyRetrievalSUM;
class ExpShareSUM extends exp_share_1.ExpShare {
    constructor() {
        super(...arguments);
        this.setNumber = '118';
        this.fullName = 'Exp. Share SUM';
        this.set = 'SUM';
    }
}
exports.ExpShareSUM = ExpShareSUM;
class NestBallSUM extends nest_ball_1.NestBall {
    constructor() {
        super(...arguments);
        this.setNumber = '123';
        this.fullName = 'Nest Ball SUM';
        this.set = 'SUM';
    }
}
exports.NestBallSUM = NestBallSUM;
class RareCandySUM extends rare_candy_1.RareCandy {
    constructor() {
        super(...arguments);
        this.setNumber = '129';
        this.fullName = 'Rare Candy SUM';
        this.set = 'SUM';
    }
}
exports.RareCandySUM = RareCandySUM;
class RotomDexSR extends rotom_dex_1.RotomDex {
    constructor() {
        super(...arguments);
        this.setNumber = '159';
        this.fullName = 'Rotom DexSR SUM';
        this.set = 'SUM';
    }
}
exports.RotomDexSR = RotomDexSR;
