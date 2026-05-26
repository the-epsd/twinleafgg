import { Prompt } from './prompt';
export class ShowCardsPrompt extends Prompt {
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
