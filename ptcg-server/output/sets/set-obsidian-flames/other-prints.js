"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArvenOBF = void 0;
const arven_1 = require("../set-scarlet-and-violet/arven");
class ArvenOBF extends arven_1.Arven {
    constructor() {
        super(...arguments);
        this.fullName = 'Arven OBF';
        this.set = 'OBF';
        this.setNumber = '186';
    }
}
exports.ArvenOBF = ArvenOBF;
