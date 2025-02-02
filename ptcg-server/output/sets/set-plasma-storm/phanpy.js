"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phanpy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Phanpy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.resistance = [{ type: card_types_1.CardType.LIGHTNING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Tackle',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 10,
                text: ''
            }, {
                name: 'Rollout',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }];
        this.set = 'PLS';
        this.name = 'Phanpy';
        this.fullName = 'Phanpy PLS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
    }
}
exports.Phanpy = Phanpy;
