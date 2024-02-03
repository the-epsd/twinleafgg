"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rattata = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Rattata extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Bite',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Rattata';
        this.fullName = 'Rattata BS';
    }
}
exports.Rattata = Rattata;
