"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowCardsPrompt = void 0;
const prompt_1 = require("./prompt");
class ShowCardsPrompt extends prompt_1.Prompt {
    constructor(playerId, message, cards, options) {
        super(playerId);
        this.message = message;
        this.cards = cards;
        this.type = 'Show cards';
        // Default options
        this.options = Object.assign({}, {
            allowCancel: false
        }, options);
    }
}
exports.ShowCardsPrompt = ShowCardsPrompt;
