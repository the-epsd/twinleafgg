"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Remoraid = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Remoraid extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Water Gun',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            },
            {
                name: 'Sharp Fin',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Remoraid';
        this.fullName = 'Remoraid BST';
    }
}
exports.Remoraid = Remoraid;
