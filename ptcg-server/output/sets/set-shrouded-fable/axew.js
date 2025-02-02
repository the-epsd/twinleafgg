"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Axew = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Axew extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 70;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 10,
                text: ''
            },
            {
                name: 'Sharp Fang',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL],
                damage: 30,
                text: ''
            },
        ];
        this.regulationMark = 'H';
        this.set = 'SFA';
        this.name = 'Axew';
        this.fullName = 'Axew SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
    }
}
exports.Axew = Axew;
