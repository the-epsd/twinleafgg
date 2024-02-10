"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysteriousFossil = void 0;
const __1 = require("../..");
const card_types_1 = require("../../game/store/card/card-types");
class MysteriousFossil extends __1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.NONE;
        this.hp = 10;
        this.weakness = [];
        this.retreat = [];
        this.text = 'Play this card as if it were a 10HP Basic Pokemon.';
        this.attacks = [];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Mysterious Fossil';
        this.fullName = 'Mysterious Fossil FO';
    }
    reduceEffect(store, state, effect) {
        this.superType = card_types_1.SuperType.TRAINER;
        return state;
    }
}
exports.MysteriousFossil = MysteriousFossil;
