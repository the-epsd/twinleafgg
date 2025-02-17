"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StevensBeldumIR = exports.MarniesMorpekoIR = exports.EnergyRecyclerSV10 = void 0;
const energy_recycler_1 = require("../set-battle-styles/energy-recycler");
const marnies_morpeko_1 = require("./marnies-morpeko");
const stevens_beldum_1 = require("./stevens-beldum");
class EnergyRecyclerSV10 extends energy_recycler_1.EnergyRecycler {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.fullName = 'Energy Recycler SV10';
        this.set = 'SV10';
        this.setNumber = '8';
    }
}
exports.EnergyRecyclerSV10 = EnergyRecyclerSV10;
class MarniesMorpekoIR extends marnies_morpeko_1.MarniesMorpeko {
    constructor() {
        super(...arguments);
        this.fullName = 'Marnie\'s MorpekoIR SVOM';
        this.setNumber = '20';
    }
}
exports.MarniesMorpekoIR = MarniesMorpekoIR;
class StevensBeldumIR extends stevens_beldum_1.StevensBeldum {
    constructor() {
        super(...arguments);
        this.fullName = 'Steven\'s BeldumIR SVOD';
        this.setNumber = '19';
    }
}
exports.StevensBeldumIR = StevensBeldumIR;
