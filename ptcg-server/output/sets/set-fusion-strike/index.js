"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFusionStrike = void 0;
const battle_vip_pass_1 = require("./battle-vip-pass");
const cross_switcher_1 = require("./cross-switcher");
const fusion_strike_energy_1 = require("./fusion-strike-energy");
const genesect_v_1 = require("./genesect-v");
const inteleon_v_1 = require("./inteleon-v");
const inteleon_vmax_1 = require("./inteleon-vmax");
const judge_1 = require("./judge");
const meloetta_1 = require("./meloetta");
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
    new meloetta_1.Meloetta(),
    new fusion_strike_energy_1.FusionStrikeEnergy(),
    new inteleon_v_1.InteleonV(),
    new inteleon_vmax_1.InteleonVMAX(),
];
