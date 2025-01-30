"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStormfront = void 0;
const gastly_1 = require("./gastly");
const luxury_ball_1 = require("./luxury-ball");
const poke_blower_1 = require("./poke-blower");
const poke_drawer_1 = require("./poke-drawer");
const sableye_1 = require("./sableye");
exports.setStormfront = [
    new luxury_ball_1.LuxuryBall(),
    new poke_blower_1.PokeBlower(),
    new poke_drawer_1.PokeDrawer(),
    new sableye_1.Sableye(),
    new gastly_1.Gastly(),
];
