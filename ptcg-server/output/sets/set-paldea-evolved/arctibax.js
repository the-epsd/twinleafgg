"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arctibax = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Arctibax extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Frigibax';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Sharp Fin',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            },
            {
                name: 'Frost Smash',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'Arctibax';
        this.fullName = 'Arctibax PAL';
    }
}
exports.Arctibax = Arctibax;
