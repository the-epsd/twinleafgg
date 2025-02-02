"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuagsireSV = exports.WooperSV = void 0;
const quagsire_1 = require("../set-dragons-majesty/quagsire");
const wooper_1 = require("../set-dragons-majesty/wooper");
class WooperSV extends wooper_1.Wooper {
    constructor() {
        super(...arguments);
        this.fullName = 'Wooper HIF';
        this.set = 'HIF';
        this.setNumber = 'SV9';
    }
}
exports.WooperSV = WooperSV;
class QuagsireSV extends quagsire_1.Quagsire {
    constructor() {
        super(...arguments);
        this.fullName = 'Quagsire HIF';
        this.set = 'HIF';
        this.setNumber = 'SV10';
    }
}
exports.QuagsireSV = QuagsireSV;
