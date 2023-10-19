"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEvolvingSkies = void 0;
const copycat_1 = require("./copycat");
const dragonite_v_1 = require("./dragonite-v");
const duraludon_vmax_1 = require("./duraludon-vmax");
const flaaffy_1 = require("./flaaffy");
const galarian_moltres_1 = require("./galarian-moltres");
const mareep_1 = require("./mareep");
const raihan_1 = require("./raihan");
const umbreon_v_1 = require("./umbreon-v");
const umbreon_vmax_1 = require("./umbreon-vmax");
exports.setEvolvingSkies = [
    new umbreon_vmax_1.UmbreonVMAX(),
    new umbreon_v_1.UmbreonV(),
    new duraludon_vmax_1.DuraludonVMAX(),
    new mareep_1.Mareep(),
    new flaaffy_1.Flaaffy(),
    new raihan_1.Raihan(),
    new galarian_moltres_1.GalarianMoltres(),
    new copycat_1.Copycat(),
    new dragonite_v_1.DragoniteV(),
];
