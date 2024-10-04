"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drakloak = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Drakloak extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Spooky Shot',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.evolvesFrom = 'Dreepy';
        this.name = 'Drakloak';
        this.fullName = 'Drakloak SIT';
    }
}
exports.Drakloak = Drakloak;
