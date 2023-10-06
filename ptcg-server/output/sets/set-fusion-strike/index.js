"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFusionStrike = void 0;
const battle_vip_pass_1 = require("./battle-vip-pass");
const cross_switcher_1 = require("./cross-switcher");
const genesect_v_1 = require("./genesect-v");
const judge_1 = require("./judge");
const mew_v_1 = require("./mew-v");
const mew_vmax_1 = require("./mew-vmax");
const oricorio_1 = require("./oricorio");
const yveltal_1 = require("./yveltal");
exports.setFusionStrike = [
    new mew_v_1.MewV(),
    new mew_vmax_1.MewVMAX(),
    new genesect_v_1.GenesectV(),
    new oricorio_1.Oricorio(),
    new battle_vip_pass_1.BattleVIPPass(),
    new judge_1.Judge(),
    new yveltal_1.Yveltal(),
    new cross_switcher_1.CrossSwitcher(),
];
