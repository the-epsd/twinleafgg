"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MisdreavusArt = exports.GladionArt = exports.CounterEnergyArt = void 0;
const counter_energy_1 = require("./counter-energy");
const gladion_1 = require("./gladion");
const misdreavus_1 = require("./misdreavus");
class CounterEnergyArt extends counter_energy_1.CounterEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CIN/CIN_100_R_EN_LG.png';
    }
}
exports.CounterEnergyArt = CounterEnergyArt;
class GladionArt extends gladion_1.Gladion {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CIN/CIN_095_R_EN_LG.png';
    }
}
exports.GladionArt = GladionArt;
class MisdreavusArt extends misdreavus_1.Misdreavus {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CIN/CIN_039_R_EN_LG.png';
    }
}
exports.MisdreavusArt = MisdreavusArt;
