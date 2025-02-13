"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPlasmaBlast = void 0;
const archen_1 = require("./archen");
const card_images_1 = require("./card-images");
const g_booster_1 = require("./g-booster");
const g_scope_1 = require("./g-scope");
const genesect_ex_1 = require("./genesect-ex");
const jirachi_ex_1 = require("./jirachi-ex");
const sawk_1 = require("./sawk");
const silver_bangle_1 = require("./silver-bangle");
const silver_mirror_1 = require("./silver-mirror");
const suicune_1 = require("./suicune");
const virizion_ex_1 = require("./virizion-ex");
const wartortle_1 = require("./wartortle");
exports.setPlasmaBlast = [
    new archen_1.Archen(),
    new jirachi_ex_1.JirachiEx(),
    new sawk_1.Sawk(),
    new silver_bangle_1.SilverBangle(),
    new silver_mirror_1.SilverMirror(),
    new suicune_1.Suicune(),
    new virizion_ex_1.VirizionEx(),
    new wartortle_1.Wartortle(),
    new genesect_ex_1.GenesectEX(),
    new g_booster_1.GBooster(),
    new g_scope_1.GScope(),
    //Reprints
    new card_images_1.ScoopUpCyclonePLB(),
    new card_images_1.UltraBallPLB(),
    new card_images_1.MasterBallPLB(),
];
