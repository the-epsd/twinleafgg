"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flittle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Flittle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Ram',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: ''
            }];
        this.set = 'SVI';
        this.regulationMark = 'G';
        this.setNumber = '100';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Flittle';
        this.fullName = 'Flittle SVI';
    }
}
exports.Flittle = Flittle;
