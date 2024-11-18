"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shroodle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Shroodle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Spray Fluid', cost: [D], damage: 20, text: '' }
        ];
        this.set = 'SSP';
        this.name = 'Shroodle';
        this.fullName = 'Shroodle SSP';
        this.regulationMark = 'H';
        this.setNumber = '120';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Shroodle = Shroodle;
