"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onix = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
// why was this played an actually good amount
class Onix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Land Crush', cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], damage: 120, text: '' }
        ];
        this.set = 'LOT';
        this.setNumber = '109';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Onix';
        this.fullName = 'Onix LOT';
    }
}
exports.Onix = Onix;
