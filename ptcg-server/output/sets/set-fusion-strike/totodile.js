"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Totodile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Totodile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Rain Splash',
                cost: [card_types_1.CardType.WATER],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Totodile';
        this.fullName = 'Totodile FST';
    }
}
exports.Totodile = Totodile;
