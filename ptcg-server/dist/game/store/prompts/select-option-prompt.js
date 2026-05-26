import { Prompt } from './prompt';
export class SelectOptionPrompt extends Prompt {
    constructor(playerId, message, values, options) {
        super(playerId);
        this.message = message;
        this.values = values;
        this.type = 'SelectOption';
        // Default options
        this.options = Object.assign({}, {
            allowCancel: true,
            defaultValue: 0,
        }, options);
    }
}
