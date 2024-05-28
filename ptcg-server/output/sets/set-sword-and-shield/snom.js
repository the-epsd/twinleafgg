"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Snom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'D';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Sprinkle Water',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            },
        ];
        this.set = 'SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Snom';
        this.fullName = 'Snom SSH';
    }
}
exports.Snom = Snom;
