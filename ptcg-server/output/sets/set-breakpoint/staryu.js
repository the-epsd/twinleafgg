"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staryu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Staryu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.resistance = [];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Smack',
                cost: [card_types_1.CardType.WATER],
                damage: 20,
                text: ''
            },
        ];
        this.set = 'BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.name = 'Staryu';
        this.fullName = 'Staryu BKP';
    }
}
exports.Staryu = Staryu;
