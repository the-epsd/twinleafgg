"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goldeen = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Goldeen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 40;
        this.weakness = [{ type: L }];
        this.attacks = [{
                name: 'Horn Attack',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Goldeen';
        this.fullName = 'Goldeen JU';
    }
}
exports.Goldeen = Goldeen;
