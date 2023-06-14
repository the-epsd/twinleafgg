import { Prompt } from './prompt';
export class InvitePlayerPrompt extends Prompt {
    constructor(playerId, message) {
        super(playerId);
        this.message = message;
        this.type = 'Invite player';
    }
}
