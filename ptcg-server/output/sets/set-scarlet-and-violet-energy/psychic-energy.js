"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsychicEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class PsychicEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.PSYCHIC];
        this.set = 'SVE';
        this.set2 = 'smpromo';
        this.setNumber = '132';
        this.name = 'Psychic Energy';
        this.fullName = 'Psychic Energy SVE';
    }
}
exports.PsychicEnergy = PsychicEnergy;
