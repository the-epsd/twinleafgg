"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cufant = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Cufant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Stampede',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '149';
        this.name = 'Cufant';
        this.fullName = 'Cufant PAL';
    }
}
exports.Cufant = Cufant;
