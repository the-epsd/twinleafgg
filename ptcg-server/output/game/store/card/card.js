"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const card_list_1 = require("../state/card-list");
const card_marker_1 = require("../state/card-marker");
class Card {
    constructor() {
        this.id = -1;
        this.regulationMark = '';
        this.tags = [];
        this.setNumber = '';
        this.cardImage = '';
        this.retreat = [];
        this.attacks = [];
        this.powers = [];
        this.cards = new card_list_1.CardList;
        this.marker = new card_marker_1.Marker();
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Card = Card;
