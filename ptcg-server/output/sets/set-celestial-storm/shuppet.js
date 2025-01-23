"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shuppet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Shuppet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Headbutt', cost: [card_types_1.CardType.COLORLESS], damage: 10, text: '' },
            { name: 'Will-o-wisp', cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS], damage: 20, text: '' }
        ];
        this.set = 'CES';
        this.setNumber = '63';
        this.name = 'Shuppet';
        this.fullName = 'Shuppet CES';
    }
}
exports.Shuppet = Shuppet;
