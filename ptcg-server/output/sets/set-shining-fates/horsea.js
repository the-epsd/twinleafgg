"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Horsea = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Horsea extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Water Gun',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'SHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Horsea';
        this.fullName = 'Horsea SHF';
    }
}
exports.Horsea = Horsea;
