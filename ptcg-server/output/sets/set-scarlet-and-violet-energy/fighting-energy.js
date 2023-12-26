"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FightingEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class FightingEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FIGHTING];
        this.set = 'SVE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '233';
        this.name = 'Basic Fighting Energy';
        this.fullName = 'Basic Fighting Energy SVE';
    }
}
exports.FightingEnergy = FightingEnergy;
