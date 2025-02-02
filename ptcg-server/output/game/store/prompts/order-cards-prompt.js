"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCardsPrompt = exports.OrderCardsPromptType = void 0;
const prompt_1 = require("./prompt");
exports.OrderCardsPromptType = 'Order cards';
class OrderCardsPrompt extends prompt_1.Prompt {
    constructor(playerId, message, cards, options) {
        super(playerId);
        this.message = message;
        this.cards = cards;
        this.type = exports.OrderCardsPromptType;
        // Default options
        this.options = Object.assign({}, {
            allowCancel: true
        }, options);
    }
    validate(result) {
        if (result === null) {
            return this.options.allowCancel;
        }
        if (result.length !== this.cards.cards.length) {
            return false;
        }
        const s = result.slice();
        s.sort();
        for (let i = 0; i < s.length; i++) {
            if (s[i] !== i) {
                return false;
            }
        }
        return true;
    }
}
exports.OrderCardsPrompt = OrderCardsPrompt;
