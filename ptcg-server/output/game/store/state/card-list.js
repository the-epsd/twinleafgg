"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardList = exports.StadiumDirection = void 0;
const card_manager_1 = require("../../cards/card-manager");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const card_types_1 = require("../card/card-types");
var StadiumDirection;
(function (StadiumDirection) {
    StadiumDirection["UP"] = "up";
    StadiumDirection["DOWN"] = "down";
})(StadiumDirection = exports.StadiumDirection || (exports.StadiumDirection = {}));
class CardList {
    constructor() {
        this.cards = [];
        this.isPublic = false;
        this.isSecret = false;
        this.faceUpPrize = false;
        this.stadiumDirection = StadiumDirection.UP;
        this.markedAsNotSecret = false;
    }
    static fromList(names) {
        const cardList = new CardList();
        const cardManager = card_manager_1.CardManager.getInstance();
        cardList.cards = names.map(cardName => {
            const card = cardManager.getCardByName(cardName);
            if (card === undefined) {
                throw new game_error_1.GameError(game_message_1.GameMessage.UNKNOWN_CARD, cardName);
            }
            return card;
        });
        return cardList;
    }
    applyOrder(order) {
        // Check if order is valid, same length
        if (this.cards.length !== order.length) {
            return;
        }
        // Contains all elements exacly one time
        const orderCopy = order.slice();
        orderCopy.sort((a, b) => a - b);
        for (let i = 0; i < orderCopy.length; i++) {
            if (i !== orderCopy[i]) {
                return;
            }
        }
        // Apply order
        const copy = this.cards.slice();
        for (let i = 0; i < order.length; i++) {
            this.cards[i] = copy[order[i]];
        }
    }
    moveTo(destination, count) {
        if (count === undefined) {
            count = this.cards.length;
        }
        count = Math.min(count, this.cards.length);
        const cards = this.cards.splice(0, count);
        destination.cards.push(...cards);
    }
    moveCardsTo(cards, destination) {
        for (let i = 0; i < cards.length; i++) {
            const index = this.cards.indexOf(cards[i]);
            if (index !== -1) {
                const card = this.cards.splice(index, 1);
                destination.cards.push(card[0]);
            }
        }
    }
    moveCardTo(card, destination) {
        this.moveCardsTo([card], destination);
    }
    moveToTopOfDestination(destination) {
        destination.cards = [...this.cards, ...destination.cards];
    }
    filter(query) {
        return this.cards.filter(c => {
            for (const key in query) {
                if (Object.prototype.hasOwnProperty.call(query, key)) {
                    const value = c[key];
                    const expected = query[key];
                    if (value !== expected) {
                        return false;
                    }
                }
            }
            return true;
        });
    }
    count(query) {
        return this.filter(query).length;
    }
    sort(superType = card_types_1.SuperType.POKEMON) {
        this.cards.sort((a, b) => {
            const result = this.compareSupertype(a.superType) - this.compareSupertype(b.superType);
            // not of the same supertype
            if (result !== 0) {
                return result;
            }
            // cards match supertype, so sort by subtype
            if (a.trainerType != null) {
                const cardA = a;
                if (cardA.trainerType != null && b.trainerType != null) {
                    const cardB = b;
                    const subtypeCompare = this.compareTrainerType(cardA.trainerType) - this.compareTrainerType(cardB.trainerType);
                    if (subtypeCompare !== 0) {
                        return subtypeCompare;
                    }
                }
            }
            else if (a.energyType != null) {
                const cardA = a;
                if (cardA.energyType != null && b.energyType != null) {
                    const cardB = b;
                    const subtypeCompare = this.compareEnergyType(cardA.energyType) - this.compareEnergyType(cardB.energyType);
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
    }
    compareSupertype(input) {
        if (input === card_types_1.SuperType.POKEMON)
            return 1;
        if (input === card_types_1.SuperType.TRAINER)
            return 2;
        if (input === card_types_1.SuperType.ENERGY)
            return 3;
        return Infinity;
    }
    compareTrainerType(input) {
        if (input === card_types_1.TrainerType.SUPPORTER)
            return 1;
        if (input === card_types_1.TrainerType.ITEM)
            return 2;
        if (input === card_types_1.TrainerType.TOOL)
            return 3;
        if (input === card_types_1.TrainerType.STADIUM)
            return 4;
        return Infinity;
    }
    compareEnergyType(input) {
        if (input === card_types_1.EnergyType.BASIC)
            return 1;
        if (input === card_types_1.EnergyType.SPECIAL)
            return 2;
        return Infinity;
    }
}
exports.CardList = CardList;
