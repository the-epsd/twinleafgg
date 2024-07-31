import { CardManager } from '../../cards/card-manager';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
export var StadiumDirection;
(function (StadiumDirection) {
    StadiumDirection["UP"] = "up";
    StadiumDirection["DOWN"] = "down";
})(StadiumDirection || (StadiumDirection = {}));
export class CardList {
    constructor() {
        this.cards = [];
        this.isPublic = false;
        this.isSecret = false;
        this.stadiumDirection = StadiumDirection.UP;
        this.markedAsNotSecret = false;
    }
    static fromList(names) {
        const cardList = new CardList();
        const cardManager = CardManager.getInstance();
        cardList.cards = names.map(cardName => {
            const card = cardManager.getCardByName(cardName);
            if (card === undefined) {
                throw new GameError(GameMessage.UNKNOWN_CARD, cardName);
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
    moveToTopOfDestination(destination) {
        destination.cards = [...this.cards, ...destination.cards];
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
