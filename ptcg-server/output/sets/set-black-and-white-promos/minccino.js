"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minccino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Minccino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING, value: 2 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Gnaw',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            },
            {
                name: 'Tail Smack',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'BWP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13'; // Set the appropriate set number
        this.name = 'Minccino';
        this.fullName = 'Minccino BWP';
    }
}
exports.Minccino = Minccino;
