"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dratini = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Dratini extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 70;
        this.weakness = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Tail Snap',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '157';
        this.name = 'Dratini';
        this.fullName = 'Dratini OBF';
    }
}
exports.Dratini = Dratini;
