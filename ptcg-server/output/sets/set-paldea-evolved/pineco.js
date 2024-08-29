"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pineco = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pineco extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Rollout',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Pineco';
        this.fullName = 'Pineco PAL';
    }
}
exports.Pineco = Pineco;
