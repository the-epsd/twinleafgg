"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MisdreavusArt = exports.LusamineArt = exports.GladionArt = exports.DevouredFieldArt = exports.CounterEnergyArt = void 0;
const counter_energy_1 = require("./counter-energy");
const devoured_field_1 = require("./devoured-field");
const gladion_1 = require("./gladion");
const lusamine_1 = require("./lusamine");
const misdreavus_1 = require("./misdreavus");
class CounterEnergyArt extends counter_energy_1.CounterEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CIN/CIN_100_R_EN_LG.png';
    }
}
exports.CounterEnergyArt = CounterEnergyArt;
class DevouredFieldArt extends devoured_field_1.DevouredField {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CIN/CIN_093_R_EN_LG.png';
    }
}
exports.DevouredFieldArt = DevouredFieldArt;
class GladionArt extends gladion_1.Gladion {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CIN/CIN_095_R_EN_LG.png';
    }
}
exports.GladionArt = GladionArt;
class LusamineArt extends lusamine_1.Lusamine {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CIN/CIN_096_R_EN_LG.png';
    }
}
exports.LusamineArt = LusamineArt;
class MisdreavusArt extends misdreavus_1.Misdreavus {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CIN/CIN_039_R_EN_LG.png';
    }
}
exports.MisdreavusArt = MisdreavusArt;
