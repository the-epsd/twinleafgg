"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grookey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Grookey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Smash Kick',
                cost: [card_types_1.CardType.GRASS],
                damage: 10,
                text: ''
            },
            {
                name: 'Branch Poke',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.name = 'Grookey';
        this.fullName = 'Grookey TWM';
    }
}
exports.Grookey = Grookey;
