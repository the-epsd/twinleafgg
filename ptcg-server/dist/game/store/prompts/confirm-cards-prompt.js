import { Prompt } from './prompt';
export class ConfirmCardsPrompt extends Prompt {
    constructor(playerId, message, cards, options) {
        super(playerId);
        this.message = message;
        this.cards = cards;
        this.type = 'Confirm cards';
        // Default options
        this.options = Object.assign({}, {
            allowCancel: false
        }, options);
    }
}
