"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machop = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Machop extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Machop';
        this.cardImage = 'assets/cardback.png';
        this.set = 'BS';
        this.setNumber = '52';
        this.fullName = 'Machop BS';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.stage = card_types_1.Stage.BASIC;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.attacks = [
            {
                name: 'Low Kick',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 20,
                text: ''
            }
        ];
    }
}
exports.Machop = Machop;
