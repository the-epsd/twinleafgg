"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterGainSSP = exports.ScrambleSwitchSSP = void 0;
const counter_gain_1 = require("../set-lost-thunder/counter-gain");
const scramble_switch_1 = require("../set-plasma-storm/scramble-switch");
class ScrambleSwitchSSP extends scramble_switch_1.ScrambleSwitch {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSP/SSP_186_R_EN_LG.png';
        this.set = 'SSP';
        this.setNumber = '186';
        this.fullName = 'Scramble Switch SSP';
        this.regulationMark = 'H';
    }
}
exports.ScrambleSwitchSSP = ScrambleSwitchSSP;
class CounterGainSSP extends counter_gain_1.CounterGain {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSP/SSP_169_R_EN_LG.png';
        this.name = 'Counter Gain';
        this.set = 'SSP';
        this.setNumber = '169';
        this.fullName = 'Counter Gain SSP';
        this.regulationMark = 'H';
    }
}
exports.CounterGainSSP = CounterGainSSP;
