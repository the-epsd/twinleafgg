"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zubat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Zubat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [];
        this.attacks = [{
                name: 'Bite',
                cost: [card_types_1.CardType.DARK],
                damage: 10,
                text: ''
            }];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '103';
        this.name = 'Zubat';
        this.fullName = 'Zubat SIT';
    }
}
exports.Zubat = Zubat;
