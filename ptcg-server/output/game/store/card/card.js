"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const card_list_1 = require("../state/card-list");
class Card {
    constructor() {
        this.id = -1;
        this.regulationMark = '';
        this.tags = [];
        this.setNumber = '';
        this.set2 = '';
        this.retreat = [];
        this.cards = new card_list_1.CardList;
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Card = Card;
