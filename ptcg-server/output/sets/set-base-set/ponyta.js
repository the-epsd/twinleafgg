"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ponyta = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Ponyta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Ponyta';
        this.cardImage = 'assets/cardback.png';
        this.set = 'BS';
        this.setNumber = '60';
        this.cardType = card_types_1.CardType.FIRE;
        this.fullName = 'Ponyta BS';
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesInto = ['Rapidash', 'Dark Rapidash'];
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Smash Kick',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
            {
                name: 'Flame Tail',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 30,
                text: ''
            }
        ];
    }
}
exports.Ponyta = Ponyta;
