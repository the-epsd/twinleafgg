import { Prompt } from './prompt';
export class AlertPrompt extends Prompt {
    constructor(playerId, message) {
        super(playerId);
        this.message = message;
        this.type = 'Alert';
    }
}
