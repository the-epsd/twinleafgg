"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setParadoxRift = void 0;
const earthen_vessel_1 = require("./earthen-vessel");
const gholdengo_ex_1 = require("./gholdengo-ex");
const gimmighoul_1 = require("./gimmighoul");
const iron_hands_ex_1 = require("./iron-hands-ex");
const mewtwo_ex_1 = require("./mewtwo-ex");
const techno_radar_1 = require("./techno-radar");
exports.setParadoxRift = [
    new gholdengo_ex_1.Gholdengoex(),
    new gimmighoul_1.Gimmighoul(),
    new mewtwo_ex_1.Mewtwoex(),
    new earthen_vessel_1.EarthenVessel(),
    new techno_radar_1.TechnoRadar(),
    new iron_hands_ex_1.IronHandsex(),
];
