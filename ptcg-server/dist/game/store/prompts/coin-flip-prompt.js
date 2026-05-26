import { Prompt } from './prompt';
export class CoinFlipPrompt extends Prompt {
    constructor(playerId, message) {
        super(playerId);
        this.message = message;
        this.type = 'Coin flip';
    }
}
