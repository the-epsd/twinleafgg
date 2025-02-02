"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Noibat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Noibat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 70;
        this.weakness = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Gust',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK],
                damage: 40,
                text: ''
            }];
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '152';
        this.name = 'Noibat';
        this.fullName = 'Noibat PAL';
    }
}
exports.Noibat = Noibat;
