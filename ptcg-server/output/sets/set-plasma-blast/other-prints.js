"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterBallPLB = exports.UltraBallPLB = exports.ScoopUpCyclonePLB = void 0;
const ultra_ball_1 = require("../set-scarlet-and-violet/ultra-ball");
const master_ball_1 = require("../set-temporal-forces/master-ball");
const scoop_up_cyclone_1 = require("../set-twilight-masquerade/scoop-up-cyclone");
class ScoopUpCyclonePLB extends scoop_up_cyclone_1.ScoopUpCyclone {
    constructor() {
        super(...arguments);
        this.set = 'PLB';
        this.setNumber = '95';
        this.fullName = 'Scoop Up Cyclone PLB';
    }
}
exports.ScoopUpCyclonePLB = ScoopUpCyclonePLB;
class UltraBallPLB extends ultra_ball_1.UltraBall {
    constructor() {
        super(...arguments);
        this.set = 'PLB';
        this.setNumber = '90';
        this.fullName = 'Ultra ball PLB';
    }
}
exports.UltraBallPLB = UltraBallPLB;
class MasterBallPLB extends master_ball_1.MasterBall {
    constructor() {
        super(...arguments);
        this.set = 'PLB';
        this.setNumber = '94';
        this.fullName = 'Master Ball PLB';
    }
}
exports.MasterBallPLB = MasterBallPLB;
