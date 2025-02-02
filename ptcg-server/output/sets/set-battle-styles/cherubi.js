"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cherubi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Cherubi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Leafage',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            },
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Cherubi';
        this.fullName = 'Cherubi BST';
    }
}
exports.Cherubi = Cherubi;
