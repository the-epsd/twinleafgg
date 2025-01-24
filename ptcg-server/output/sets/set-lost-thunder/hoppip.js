"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hoppip = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Hoppip extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'LOT';
        this.setNumber = '12';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hoppip';
        this.fullName = 'Hoppip LOT';
    }
}
exports.Hoppip = Hoppip;
