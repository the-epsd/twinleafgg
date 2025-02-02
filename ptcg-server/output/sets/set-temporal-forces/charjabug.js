"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charjabug = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Charjabug extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Grubbin';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Static Shock',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Charjabug';
        this.fullName = 'Charjabug TEF';
    }
}
exports.Charjabug = Charjabug;
