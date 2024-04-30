"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dratini = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Dratini extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Dratini';
        this.set = 'BS';
        this.fullName = 'Dratini BS';
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesInto = ['Dragonair', 'Dark Dragonair', 'Light Dragonair'];
        this.hp = 40;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Pound',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }
        ];
    }
}
exports.Dratini = Dratini;
