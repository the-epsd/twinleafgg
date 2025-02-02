"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raboot = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Raboot extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Scorbunny';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Low Sweep',
                cost: [card_types_1.CardType.FIRE],
                damage: 30,
                text: ''
            },
            {
                name: 'Combustion',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.name = 'Raboot';
        this.fullName = 'Raboot SV7';
    }
}
exports.Raboot = Raboot;
