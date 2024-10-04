"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Psyduck = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Psyduck extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 60;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.attacks = [{
                name: 'Headache',
                cost: [card_types_1.CardType.WATER],
                damage: 20,
                text: ''
            }];
        this.set = 'HIF';
        this.setNumber = '11';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Psyduck';
        this.fullName = 'Psyduck HIF';
    }
}
exports.Psyduck = Psyduck;
