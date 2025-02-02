"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cufant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Cufant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            },
            {
                name: 'Confront',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            },
        ];
        this.regulationMark = 'H';
        this.set = 'SV6a';
        this.name = 'Cufant';
        this.fullName = 'Cufant SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
    }
}
exports.Cufant = Cufant;
