"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.CardList = exports.StadiumDirection = void 0;
var card_manager_1 = require("../../cards/card-manager");
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
var card_types_1 = require("../card/card-types");
var StadiumDirection;
(function (StadiumDirection) {
    StadiumDirection["UP"] = "up";
    StadiumDirection["DOWN"] = "down";
})(StadiumDirection = exports.StadiumDirection || (exports.StadiumDirection = {}));
var CardList = /** @class */ (function () {
    function CardList() {
        this.cards = [];
        this.isPublic = false;
        this.isSecret = false;
        this.faceUpPrize = false;
        this.stadiumDirection = StadiumDirection.UP;
        this.markedAsNotSecret = false;
    }
    CardList.fromList = function (names) {
        var cardList = new CardList();
        var cardManager = card_manager_1.CardManager.getInstance();
        cardList.cards = names.map(function (cardName) {
            var card = cardManager.getCardByName(cardName);
            if (card === undefined) {
                throw new game_error_1.GameError(game_message_1.GameMessage.UNKNOWN_CARD, cardName);
            }
            return card;
        });
        return cardList;
    };
    CardList.prototype.applyOrder = function (order) {
        // Check if order is valid, same length
        if (this.cards.length !== order.length) {
            return;
        }
        // Contains all elements exacly one time
        var orderCopy = order.slice();
        orderCopy.sort(function (a, b) { return a - b; });
        for (var i = 0; i < orderCopy.length; i++) {
            if (i !== orderCopy[i]) {
                return;
            }
        }
        // Apply order
        var copy = this.cards.slice();
        for (var i = 0; i < order.length; i++) {
            this.cards[i] = copy[order[i]];
        }
    };
    CardList.prototype.moveTo = function (destination, count) {
        var _a;
        if (count === undefined) {
            count = this.cards.length;
        }
        count = Math.min(count, this.cards.length);
        var cards = this.cards.splice(0, count);
        (_a = destination.cards).push.apply(_a, cards);
    };
    CardList.prototype.moveCardsTo = function (cards, destination) {
        for (var i = 0; i < cards.length; i++) {
            var index = this.cards.indexOf(cards[i]);
            if (index !== -1) {
                var card = this.cards.splice(index, 1);
                destination.cards.push(card[0]);
            }
        }
    };
    CardList.prototype.moveCardTo = function (card, destination) {
        this.moveCardsTo([card], destination);
    };
    CardList.prototype.moveToTopOfDestination = function (destination) {
        destination.cards = __spreadArray(__spreadArray([], this.cards), destination.cards);
    };
    CardList.prototype.filter = function (query) {
        return this.cards.filter(function (c) {
            for (var key in query) {
                if (Object.prototype.hasOwnProperty.call(query, key)) {
                    var value = c[key];
                    var expected = query[key];
                    if (value !== expected) {
                        return false;
                    }
                }
            }
            return true;
        });
    };
    CardList.prototype.count = function (query) {
        return this.filter(query).length;
    };
    CardList.prototype.sort = function (superType) {
        var _this = this;
        if (superType === void 0) { superType = card_types_1.SuperType.POKEMON; }
        this.cards.sort(function (a, b) {
            var result = _this.compareSupertype(a.superType) - _this.compareSupertype(b.superType);
            // not of the same supertype
            if (result !== 0) {
                return result;
            }
            // cards match supertype, so sort by subtype
            if (a.trainerType != null) {
                var cardA = a;
                if (cardA.trainerType != null && b.trainerType != null) {
                    var cardB = b;
                    var subtypeCompare = _this.compareTrainerType(cardA.trainerType) - _this.compareTrainerType(cardB.trainerType);
                    if (subtypeCompare !== 0) {
                        return subtypeCompare;
                    }
                }
            }
            else if (a.energyType != null) {
                var cardA = a;
                if (cardA.energyType != null && b.energyType != null) {
                    var cardB = b;
                    var subtypeCompare = _this.compareEnergyType(cardA.energyType) - _this.compareEnergyType(cardB.energyType);
                    if (subtypeCompare !== 0) {
                        return subtypeCompare;
                    }
                }
            }
            // subtype matches, sort by name
            if (a.name < b.name) {
                return -1;
            }
            else {
                return 1;
            }
        });
    };
    CardList.prototype.compareSupertype = function (input) {
        if (input === card_types_1.SuperType.POKEMON)
            return 1;
        if (input === card_types_1.SuperType.TRAINER)
            return 2;
        if (input === card_types_1.SuperType.ENERGY)
            return 3;
        return Infinity;
    };
    CardList.prototype.compareTrainerType = function (input) {
        if (input === card_types_1.TrainerType.SUPPORTER)
            return 1;
        if (input === card_types_1.TrainerType.ITEM)
            return 2;
        if (input === card_types_1.TrainerType.TOOL)
            return 3;
        if (input === card_types_1.TrainerType.STADIUM)
            return 4;
        return Infinity;
    };
    CardList.prototype.compareEnergyType = function (input) {
        if (input === card_types_1.EnergyType.BASIC)
            return 1;
        if (input === card_types_1.EnergyType.SPECIAL)
            return 2;
        return Infinity;
    };
    return CardList;
}());
exports.CardList = CardList;
