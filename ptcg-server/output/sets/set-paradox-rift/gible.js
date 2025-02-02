"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gible = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Gible extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Bite',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Gible';
        this.fullName = 'Gible PAR';
    }
}
exports.Gible = Gible;
