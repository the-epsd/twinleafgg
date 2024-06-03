"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machop = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Machop extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Punch',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 20,
                text: ''
            }
        ];
        this.regulationMark = 'f';
        this.set = 'LOR';
        this.name = 'Machop';
        this.fullName = 'Machop LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
    }
}
exports.Machop = Machop;
