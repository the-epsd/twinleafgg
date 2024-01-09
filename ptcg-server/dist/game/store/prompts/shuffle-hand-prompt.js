import { Prompt } from './prompt';
export class ShuffleHandPrompt extends Prompt {
    constructor(playerId) {
        super(playerId);
        this.type = 'Shuffle hand';
    }
    validate(result, state) {
        if (result === null) {
            return false;
        }
        const player = state.players.find(p => p.id === this.playerId);
        if (player === undefined) {
            return false;
        }
        if (result.length !== player.hand.cards.length) {
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
