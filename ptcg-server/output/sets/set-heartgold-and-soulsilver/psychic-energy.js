"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsychicEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class PsychicEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.PSYCHIC];
        this.set = 'HS';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '119';
        this.name = 'Psychic Energy';
        this.fullName = 'Psychic Energy HS';
    }
}
exports.PsychicEnergy = PsychicEnergy;
