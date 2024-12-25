"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tepig = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Tepig extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesInto = 'Pignite';
        this.attacks = [{
                name: 'Ram',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
            {
                name: 'Combustion',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
        this.regulationMark = 'E';
        this.set = 'SWSH';
        this.name = 'Tepig';
        this.fullName = 'Tepig SWSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '172';
    }
}
exports.Tepig = Tepig;
