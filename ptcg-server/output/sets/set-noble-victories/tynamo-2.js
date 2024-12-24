"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tynamo2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Tynamo2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.attacks = [{
                name: 'Tackle',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }];
        this.set = 'NVI';
        this.name = 'Tynamo';
        this.fullName = 'Tynamo NVI 39';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
    }
}
exports.Tynamo2 = Tynamo2;
