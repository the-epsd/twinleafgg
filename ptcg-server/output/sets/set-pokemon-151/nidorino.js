"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidorino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Nidorino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = card_types_1.CardType.DARK;
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nidoran M';
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Sharp Fang',
                cost: [card_types_1.CardType.DARK],
                damage: 30,
                text: ''
            },
            {
                name: 'Superpowered Horns',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }
        ];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Nidorino';
        this.fullName = 'Nidorino MEW';
    }
}
exports.Nidorino = Nidorino;
