"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rowlet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Rowlet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Tackle', cost: [card_types_1.CardType.COLORLESS], damage: 10, text: '' },
            { name: 'Leafage', cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS], damage: 20, text: '' }
        ];
        this.set = 'SUM';
        this.setNumber = '9';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Rowlet';
        this.fullName = 'Rowlet SUM';
    }
}
exports.Rowlet = Rowlet;
