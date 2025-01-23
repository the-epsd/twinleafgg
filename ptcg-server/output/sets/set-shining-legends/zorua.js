"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zorua = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Zorua extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Stampede', cost: [card_types_1.CardType.DARK], damage: 10, text: '' },
            { name: 'Ram', cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], damage: 20, text: '' }
        ];
        this.set = 'SLG';
        this.setNumber = '52';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zorua';
        this.fullName = 'Zorua SLG';
    }
}
exports.Zorua = Zorua;
