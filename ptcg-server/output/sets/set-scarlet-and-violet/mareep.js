"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mareep = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Mareep extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Static Shock',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 10,
                text: ''
            },
            {
                name: 'Electro Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Mareep';
        this.fullName = 'Mareep SVI';
    }
}
exports.Mareep = Mareep;
