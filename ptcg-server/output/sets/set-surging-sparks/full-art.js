"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeebasIR = exports.LarvestaIR = void 0;
const feebas_1 = require("./feebas");
const larvesta_1 = require("./larvesta");
class LarvestaIR extends larvesta_1.Larvesta {
    constructor() {
        super(...arguments);
        this.setNumber = '196';
        this.fullName = 'LarvestaIR SSP';
    }
}
exports.LarvestaIR = LarvestaIR;
class FeebasIR extends feebas_1.Feebas {
    constructor() {
        super(...arguments);
        this.setNumber = '198';
        this.fullName = 'FeebasIR SSP';
    }
}
exports.FeebasIR = FeebasIR;
