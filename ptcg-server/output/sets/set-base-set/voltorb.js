"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voltorb = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Voltorb extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Voltorb';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.set = 'BS';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.fullName = 'Voltorb BS';
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesInto = ['Electrode', 'Electrode-GX', 'Dark Electrode', 'Electrode ex'];
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }
        ];
    }
}
exports.Voltorb = Voltorb;
