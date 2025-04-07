"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNeoGenesis = void 0;
const bills_teleporter_1 = require("./bills-teleporter");
const mary_1 = require("./mary");
exports.setNeoGenesis = [
    new bills_teleporter_1.BillsTeleporter(),
    new mary_1.Mary(),
];
