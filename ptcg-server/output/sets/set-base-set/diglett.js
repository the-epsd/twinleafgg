"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diglett = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Diglett extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Diglett';
        this.cardImage = 'assets/cardback.png';
        this.set = 'BS';
        this.setNumber = '47';
        this.fullName = 'Diglett BS';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.resistance = [{ type: card_types_1.CardType.LIGHTNING, value: -30 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Dig',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 10,
                text: ''
            },
            {
                name: 'Mud Slap',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 30,
                text: ''
            }
        ];
    }
}
exports.Diglett = Diglett;
