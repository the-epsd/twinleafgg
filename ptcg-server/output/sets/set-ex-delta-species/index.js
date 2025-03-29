"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEXDeltaSpecies = void 0;
const holons_electrode_1 = require("./holons-electrode");
const holons_voltorb_1 = require("./holons-voltorb");
const other_prints_1 = require("./other-prints");
exports.setEXDeltaSpecies = [
    new holons_electrode_1.HolonsElectrode(),
    new holons_voltorb_1.HolonsVoltorb(),
    new other_prints_1.SuperScoopUpDS(),
];
