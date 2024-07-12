"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arrokuda = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Arrokuda extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 60;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.attacks = [{
                name: 'Rain Splash',
                cost: [card_types_1.CardType.WATER],
                damage: 20,
                text: ''
            }];
        this.set = 'RCL';
        this.setNumber = '52';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Arrokuda';
        this.fullName = 'Arrokuda RCL';
    }
}
exports.Arrokuda = Arrokuda;
