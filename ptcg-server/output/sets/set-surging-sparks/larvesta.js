"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Larvesta = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Larvesta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            { name: 'Ram', cost: [C], damage: 10, text: '' },
            { name: 'Steady Firebreathing', cost: [R, C], damage: 20, text: '' }
        ];
        this.set = 'SSP';
        this.name = 'Larvesta';
        this.fullName = 'Larvesta SSP';
        this.regulationMark = 'H';
        this.setNumber = '24';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Larvesta = Larvesta;
