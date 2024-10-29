"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Marill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Rolling Tackle',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 20,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.name = 'Marill';
        this.fullName = 'Marill svLN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
    }
}
exports.Marill = Marill;
