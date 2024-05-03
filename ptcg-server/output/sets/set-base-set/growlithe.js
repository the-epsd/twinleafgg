"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Growlithe = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Growlithe extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.set = 'BS';
        this.fullName = 'Growlithe BS';
        this.name = 'Growlithe';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Flare',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }
        ];
    }
}
exports.Growlithe = Growlithe;
