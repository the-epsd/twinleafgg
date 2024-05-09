"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardList = void 0;
const card_manager_1 = require("../../cards/card-manager");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
class CardList {
    constructor() {
        this.cards = [];
        this.isPublic = false;
        this.isSecret = false;
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
    top(count = 1) {
        count = Math.min(count, this.cards.length);
        return this.cards.slice(0, count);
    }
    moveToTop(cards) {
        this.cards = [...cards, ...this.cards];
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
}
exports.CardList = CardList;
