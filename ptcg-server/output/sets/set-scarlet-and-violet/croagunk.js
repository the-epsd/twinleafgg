"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Croagunk = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Croagunk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Beat',
                cost: [card_types_1.CardType.DARK],
                damage: 10,
                text: ''
            },
            {
                name: 'Whap Down',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '130';
        this.name = 'Croagunk';
        this.fullName = 'Croagunk SVI';
    }
}
exports.Croagunk = Croagunk;
