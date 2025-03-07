"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cherubi = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Cherubi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Leafage',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
        ];
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Cherubi';
        this.fullName = 'Cherubi BRS';
    }
}
exports.Cherubi = Cherubi;
