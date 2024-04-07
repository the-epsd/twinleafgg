"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dreepy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Dreepy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 70;
        this.weakness = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Slight Jealousy',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: ''
            },
            {
                name: 'Bite',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.PSYCHIC],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'SV6';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Dreepy';
        this.fullName = 'Dreepy SV6';
    }
}
exports.Dreepy = Dreepy;
