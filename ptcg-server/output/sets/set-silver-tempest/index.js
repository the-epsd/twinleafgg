"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSilverTempest = void 0;
const archeops_1 = require("./archeops");
const forest_seal_stone_1 = require("./forest-seal-stone");
const kirlia_1 = require("./kirlia");
const lugia_v_1 = require("./lugia-v");
const lugia_vstar_1 = require("./lugia-vstar");
const radiant_alakazam_1 = require("./radiant-alakazam");
const worker_1 = require("./worker");
exports.setSilverTempest = [
    new kirlia_1.Kirlia(),
    new radiant_alakazam_1.RadiantAlakazam(),
    new worker_1.Worker(),
    new forest_seal_stone_1.ForestSealStone(),
    new lugia_v_1.LugiaV(),
    new lugia_vstar_1.LugiaVSTAR(),
    new archeops_1.Archeops(),
];
