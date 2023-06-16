"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quaxwell = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Quaxwell extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Quaxly';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
            name: 'Rain Splash',
            cost: [ card_types_1.CardType.WATER ],
            damage: 20,
            text: ''
            },
            {
                name: 'Spiral Kick',
                cost: [ card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS ],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'SVI';
        this.name = 'Quaxwell';
        this.fullName = 'Quaxwell SVI 053';
    }
}
exports.Quaxwell = Quaxwell;
