"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sobble = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Sobble extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Pound',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            },
            {
                name: 'Water Gun',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Sobble';
        this.fullName = 'Sobble SSH';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Sobble = Sobble;
