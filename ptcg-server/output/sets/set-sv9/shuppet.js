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
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Spooky Shot', cost: [card_types_1.CardType.PSYCHIC], damage: 20, text: '' }
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Shuppet';
        this.fullName = 'Shuppet SV9';
    }
}
exports.Shuppet = Shuppet;
