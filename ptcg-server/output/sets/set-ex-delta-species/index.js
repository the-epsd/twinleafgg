"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEXDeltaSpecies = void 0;
const holons_electrode_1 = require("./holons-electrode");
const holons_voltorb_1 = require("./holons-voltorb");
const meowth_1 = require("./meowth");
const persian_1 = require("./persian");
const other_prints_1 = require("./other-prints");
exports.setEXDeltaSpecies = [
    new holons_electrode_1.HolonsElectrode(),
    new holons_voltorb_1.HolonsVoltorb(),
    new meowth_1.Meowth(),
    new persian_1.Persian(),
    new other_prints_1.SuperScoopUpDS(),
];
