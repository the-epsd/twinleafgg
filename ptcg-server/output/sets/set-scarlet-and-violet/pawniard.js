"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pawniard = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pawniard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Stampede', cost: [card_types_1.CardType.COLORLESS], damage: 10, text: '' },
            { name: 'Ram', cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS], damage: 20, text: '' }
        ];
        this.set = 'SVI';
        this.setNumber = '132';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Pawniard';
        this.fullName = 'Pawniard SVI';
    }
}
exports.Pawniard = Pawniard;
