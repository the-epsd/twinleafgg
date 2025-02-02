"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnomSV = exports.ApplinSV = void 0;
const applin_1 = require("../set-rebel-clash/applin");
const snom_1 = require("./snom");
class ApplinSV extends applin_1.Applin {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV12';
        this.fullName = 'Applin SHF';
    }
}
exports.ApplinSV = ApplinSV;
class SnomSV extends snom_1.Snom {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV33';
        this.fullName = 'Snom SHFSV';
    }
}
exports.SnomSV = SnomSV;
