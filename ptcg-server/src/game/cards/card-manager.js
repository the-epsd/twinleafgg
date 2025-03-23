"use strict";
exports.__esModule = true;
exports.CardManager = void 0;
var utils_1 = require("../../utils/utils");
var CardManager = /** @class */ (function () {
    function CardManager() {
        this.cards = [];
    }
    CardManager.getInstance = function () {
        if (!CardManager.instance) {
            CardManager.instance = new CardManager();
        }
        return CardManager.instance;
    };
    CardManager.prototype.defineSet = function (cards) {
        var _a;
        (_a = this.cards).push.apply(_a, cards);
    };
    CardManager.prototype.defineCard = function (card) {
        this.cards.push(card);
    };
    CardManager.prototype.getCardByName = function (name) {
        var card = this.cards.find(function (c) { return c.fullName === name; });
        if (card !== undefined) {
            card = utils_1.deepClone(card);
        }
        return card;
    };
    CardManager.prototype.isCardDefined = function (name) {
        return this.cards.find(function (c) { return c.fullName === name; }) !== undefined;
    };
    CardManager.prototype.getAllCards = function () {
        return this.cards;
    };
    return CardManager;
}());
exports.CardManager = CardManager;
