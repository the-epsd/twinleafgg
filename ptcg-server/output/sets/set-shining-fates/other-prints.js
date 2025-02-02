"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrosmothSHF = void 0;
const frosmoth_1 = require("../set-sword-and-shield/frosmoth");
class FrosmothSHF extends frosmoth_1.Frosmoth {
    constructor() {
        super(...arguments);
        this.fullName = 'Frosmoth SHF';
        this.set = 'SHF';
        this.setNumber = '30';
    }
}
exports.FrosmothSHF = FrosmothSHF;
