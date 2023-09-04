"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alakazamex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Alakazamex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 310;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Mind Jack',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            },
            {
                name: 'Dimensional Manipulation',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'You may use this attack even if this Pokemon is on the Bench.'
            }
        ];
        this.set = '151';
        this.name = 'Alakazam ex';
        this.fullName = 'Alakazam ex MEW 065';
    }
}
exports.Alakazamex = Alakazamex;
