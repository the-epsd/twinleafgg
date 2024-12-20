"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEmergingPowers = void 0;
const bianca_1 = require("./bianca");
const cheren_1 = require("./cheren");
const crushing_hammer_1 = require("./crushing-hammer");
const max_potion_1 = require("./max-potion");
const tornadus_1 = require("./tornadus");
exports.setEmergingPowers = [
    new bianca_1.Bianca(),
    new cheren_1.Cheren(),
    new crushing_hammer_1.CrushingHammer(),
    new max_potion_1.MaxPotion(),
    new tornadus_1.Tornadus(),
];
