"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setChampionsPath = void 0;
const eldegoss_v_1 = require("./eldegoss-v");
const galarian_obstagoon_1 = require("./galarian-obstagoon");
const piers_1 = require("./piers");
const rotom_phone_1 = require("./rotom-phone");
const sonia_1 = require("./sonia");
const turffield_stadium_1 = require("./turffield-stadium");
const weedle_1 = require("./weedle");
exports.setChampionsPath = [
    new eldegoss_v_1.EldegossV(),
    new galarian_obstagoon_1.GalarianObstagoon(),
    new piers_1.Piers(),
    new rotom_phone_1.RotomPhone(),
    new sonia_1.Sonia(),
    new turffield_stadium_1.TurffieldStadium(),
    new weedle_1.WeedleCPA(),
];
