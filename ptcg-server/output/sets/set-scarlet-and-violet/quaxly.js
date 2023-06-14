"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quaxly = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Quaxly extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
            name: 'Pound',
            cost: [ card_types_1.CardType.COLORLESS ],
            damage: 10,
                text: ''
            },
            {
                name: 'Kick',
                cost: [ card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS ],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'SVI';
        this.name = 'Quaxly';
        this.fullName = 'Quaxly SVI 52';
    }
}
exports.Quaxly = Quaxly;
