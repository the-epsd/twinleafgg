"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staryu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Staryu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Staryu';
        this.cardImage = 'assets/cardback.png';
        this.set = 'BS';
        this.fullName = 'Staryu BS';
        this.setNumber = '65';
        this.cardType = card_types_1.CardType.WATER;
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesInto = ['Starmie', 'Starmie-GX'];
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Slap',
                cost: [card_types_1.CardType.WATER],
                damage: 20,
                text: ''
            }
        ];
    }
}
exports.Staryu = Staryu;
