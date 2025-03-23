"use strict";
exports.__esModule = true;
exports.Card = void 0;
var card_list_1 = require("../state/card-list");
var card_marker_1 = require("../state/card-marker");
var Card = /** @class */ (function () {
    function Card() {
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
    Card.prototype.reduceEffect = function (store, state, effect) {
        return state;
    };
    return Card;
}());
exports.Card = Card;
