"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chewtle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Chewtle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Headbutt',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.name = 'Chewtle';
        this.fullName = 'Chewtle SV7';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
    }
}
exports.Chewtle = Chewtle;
