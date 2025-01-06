"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterGainSSP = exports.ScrambleSwitchSSP = void 0;
const counter_gain_1 = require("../set-lost-thunder/counter-gain");
const scramble_switch_1 = require("../set-plasma-storm/scramble-switch");
class ScrambleSwitchSSP extends scramble_switch_1.ScrambleSwitch {
    constructor() {
        super(...arguments);
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
        this.set = 'SSP';
        this.setNumber = '169';
        this.fullName = 'Counter Gain SSP';
        this.regulationMark = 'H';
    }
}
exports.CounterGainSSP = CounterGainSSP;
