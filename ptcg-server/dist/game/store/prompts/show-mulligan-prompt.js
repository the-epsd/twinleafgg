import { Prompt } from './prompt';
export class ShowMulliganPrompt extends Prompt {
    constructor(playerId, message, hands, options) {
        super(playerId);
        this.message = message;
        this.type = 'Show mulligan';
        this.hands = hands;
        // Default options
        this.options = Object.assign({}, {
            allowCancel: false
        }, options);
    }
}
