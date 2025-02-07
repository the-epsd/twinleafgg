"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSV9a = void 0;
const ethans_adventure_1 = require("./ethans-adventure");
const ethans_cyndaquil_1 = require("./ethans-cyndaquil");
const ethans_ho_oh_ex_1 = require("./ethans-ho-oh-ex");
const ethans_magcargo_1 = require("./ethans-magcargo");
const ethans_pichu_1 = require("./ethans-pichu");
const ethans_quilava_1 = require("./ethans-quilava");
const ethans_slugma_1 = require("./ethans-slugma");
const ethans_typhlosion_1 = require("./ethans-typhlosion");
const other_prints_1 = require("./other-prints");
exports.setSV9a = [
    new ethans_adventure_1.EthansAdventure(),
    new ethans_ho_oh_ex_1.EthansHoOhex(),
    new ethans_cyndaquil_1.EthansCyndaquil(),
    new ethans_quilava_1.EthansQuilava(),
    new ethans_typhlosion_1.EthansTyphlosion(),
    new ethans_slugma_1.EthansSlugma(),
    new ethans_magcargo_1.EthansMagcargo(),
    new ethans_pichu_1.EthansPichu(),
    // Reprints
    new other_prints_1.SacredAshSV9a(),
];
