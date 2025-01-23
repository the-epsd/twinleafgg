"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DucklettDAA = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class DucklettDAA extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Flap', cost: [card_types_1.CardType.COLORLESS], damage: 20, text: '' },
        ];
        this.set = 'DAA';
        this.setNumber = '148';
        this.regulationMark = 'D';
        this.name = 'Ducklett';
        this.fullName = 'Ducklett DAA';
    }
}
exports.DucklettDAA = DucklettDAA;
