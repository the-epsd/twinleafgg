"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPlasmaBlast = void 0;
const master_ball_1 = require("../set-temporal-forces/master-ball");
const jirachi_ex_1 = require("./jirachi-ex");
const scoop_up_cyclone_1 = require("./scoop-up-cyclone");
const silver_bangle_1 = require("./silver-bangle");
const ultra_ball_1 = require("./ultra-ball");
const virizion_ex_1 = require("./virizion-ex");
const wartortle_1 = require("./wartortle");
exports.setPlasmaBlast = [
    new jirachi_ex_1.JirachiEx(),
    new scoop_up_cyclone_1.ScoopUpCyclone(),
    new silver_bangle_1.SilverBangle(),
    new ultra_ball_1.UltraBall(),
    new virizion_ex_1.VirizionEx(),
    new master_ball_1.MasterBall(),
    new wartortle_1.Wartortle()
];
