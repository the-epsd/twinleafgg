import { Prompt } from './prompt';
export class WaitPrompt extends Prompt {
    constructor(playerId, duration, message) {
        super(playerId);
        this.type = 'WaitPrompt';
        this.duration = duration;
        this.message = message;
    }
}
