"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiasRoseradeIR = exports.EthansHoOhexSIR = exports.SacredAshSV9a = void 0;
const sacred_ash_1 = require("../set-flashfire/sacred-ash");
const cynthias_roserade_1 = require("./cynthias-roserade");
const ethans_ho_oh_ex_1 = require("./ethans-ho-oh-ex");
class SacredAshSV9a extends sacred_ash_1.SacredAsh {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.fullName = 'Sacred Ash SV9a';
        this.set = 'SV9a';
        this.setNumber = '56';
    }
}
exports.SacredAshSV9a = SacredAshSV9a;
class EthansHoOhexSIR extends ethans_ho_oh_ex_1.EthansHoOhex {
    constructor() {
        super(...arguments);
        this.fullName = 'Ethan\'s Ho-OhexSIR SV9a';
        this.setNumber = '86';
    }
}
exports.EthansHoOhexSIR = EthansHoOhexSIR;
class CynthiasRoseradeIR extends cynthias_roserade_1.CynthiasRoserade {
    constructor() {
        super(...arguments);
        this.fullName = 'Cynthia\'s RoseradeIR SV9a';
        this.setNumber = '65';
    }
}
exports.CynthiasRoseradeIR = CynthiasRoseradeIR;
