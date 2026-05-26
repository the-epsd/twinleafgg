import { Prompt } from './prompt';
export class ConfirmPrompt extends Prompt {
    constructor(playerId, message) {
        super(playerId);
        this.message = message;
        this.type = 'Confirm';
    }
}
