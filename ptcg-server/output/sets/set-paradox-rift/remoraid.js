"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Remoraid = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Remoraid extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Sprinkle Water',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            },
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Remoraid';
        this.fullName = 'Remoraid PAR';
    }
}
exports.Remoraid = Remoraid;
