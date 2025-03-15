"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiasRoseradeIR = exports.EthansHoOhexSIR = void 0;
const cynthias_roserade_1 = require("./cynthias-roserade");
const ethans_ho_oh_ex_1 = require("./ethans-ho-oh-ex");
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
