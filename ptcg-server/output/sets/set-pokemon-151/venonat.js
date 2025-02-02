"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venonat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Venonat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Gnaw',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: '',
            },
            {
                name: 'Beam',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: '',
            }
        ];
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Venonat';
        this.fullName = 'Venonat MEW';
    }
}
exports.Venonat = Venonat;
