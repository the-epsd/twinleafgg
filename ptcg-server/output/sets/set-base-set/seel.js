"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Seel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Seel';
        this.cardImage = 'assets/cardback.png';
        this.set = 'BS';
        this.setNumber = '41';
        this.fullName = 'Seel BS';
        this.cardType = card_types_1.CardType.WATER;
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Headbutt',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            }
        ];
    }
}
exports.Seel = Seel;
