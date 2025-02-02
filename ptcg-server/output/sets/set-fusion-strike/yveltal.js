"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yveltal = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Yveltal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.SINGLE_STRIKE];
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Dark Cutter',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 50,
                text: '   '
            },
            {
                name: 'Single Strike Wings',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 110,
                text: '   '
            }
        ];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '175';
        this.name = 'Yveltal';
        this.fullName = 'Yveltal FST';
    }
}
exports.Yveltal = Yveltal;
