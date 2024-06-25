"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hitmonchan = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Hitmonchan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Jab',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 20,
                text: ''
            },
            {
                name: 'Special Punch',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Hitmonchan';
        this.fullName = 'Hitmonchan BS';
    }
}
exports.Hitmonchan = Hitmonchan;
