"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XerneasArt = exports.MisdreavusArt = exports.LusamineArt = exports.KartanaGXArt = exports.GladionArt = exports.DevouredFieldArt = exports.CounterEnergyArt = exports.ChimechoArt = exports.BuzzwoleGXArt = void 0;
const buzzwole_gx_1 = require("./buzzwole-gx");
const chimecho_1 = require("./chimecho");
const counter_energy_1 = require("./counter-energy");
const devoured_field_1 = require("./devoured-field");
const gladion_1 = require("./gladion");
const kartana_gx_1 = require("./kartana-gx");
const lusamine_1 = require("./lusamine");
const misdreavus_1 = require("./misdreavus");
const xerneas_1 = require("./xerneas");
class BuzzwoleGXArt extends buzzwole_gx_1.BuzzwoleGX {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CIN/CIN_057_R_EN.png';
    }
}
exports.BuzzwoleGXArt = BuzzwoleGXArt;
class ChimechoArt extends chimecho_1.Chimecho {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CIN/CIN_043_R_EN_LG.png';
    }
}
exports.ChimechoArt = ChimechoArt;
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
class KartanaGXArt extends kartana_gx_1.KartanaGX {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CIN/CIN_070_R_EN.png';
    }
}
exports.KartanaGXArt = KartanaGXArt;
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
class XerneasArt extends xerneas_1.Xerneas {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CIN/CIN_073_R_EN_LG.png';
    }
}
exports.XerneasArt = XerneasArt;
