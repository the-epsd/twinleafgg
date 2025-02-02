"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardManager = void 0;
const utils_1 = require("../../utils/utils");
class CardManager {
    constructor() {
        this.cards = [];
    }
    static getInstance() {
        if (!CardManager.instance) {
            CardManager.instance = new CardManager();
        }
        return CardManager.instance;
    }
    defineSet(cards) {
        this.cards.push(...cards);
    }
    defineCard(card) {
        this.cards.push(card);
    }
    getCardByName(name) {
        let card = this.cards.find(c => c.fullName === name);
        if (card !== undefined) {
            card = utils_1.deepClone(card);
        }
        return card;
    }
    isCardDefined(name) {
        return this.cards.find(c => c.fullName === name) !== undefined;
    }
    getAllCards() {
        return this.cards;
    }
}
exports.CardManager = CardManager;
