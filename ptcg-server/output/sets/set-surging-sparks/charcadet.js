"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charcadet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Charcadet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Phantom Fire',
                cost: [card_types_1.CardType.FIRE],
                damage: 20,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.name = 'Charcadet';
        this.fullName = 'Charcadet SVP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
    }
}
exports.Charcadet = Charcadet;
