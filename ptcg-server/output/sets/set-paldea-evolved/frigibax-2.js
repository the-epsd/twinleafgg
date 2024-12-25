"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frigibax2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Frigibax2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Chilly',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            },
            {
                name: 'Bite',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Frigibax';
        this.fullName = 'Frigibax PAL2';
    }
}
exports.Frigibax2 = Frigibax2;
