import { Prompt } from './prompt';
export const OrderCardsPromptType = 'Order cards';
export class OrderCardsPrompt extends Prompt {
    constructor(playerId, message, cards, options) {
        super(playerId);
        this.message = message;
        this.cards = cards;
        this.type = OrderCardsPromptType;
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
