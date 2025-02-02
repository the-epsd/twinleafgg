import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
export const ChooseAttackPromptType = 'Choose attack';
export class ChooseAttackPrompt extends Prompt {
    constructor(playerId, message, cards, options) {
        super(playerId);
        this.message = message;
        this.cards = cards;
        this.type = ChooseAttackPromptType;
        // Default options
        this.options = Object.assign({}, {
            allowCancel: false,
            blockedMessage: GameMessage.NOT_ENOUGH_ENERGY,
            blocked: []
        }, options);
    }
    decode(result, state) {
        if (result === null) {
            return result; // operation cancelled
        }
        const index = result.index;
        if (index < 0 || index >= this.cards.length) {
            throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        }
        const card = this.cards[index];
        const attack = card.attacks.find(a => a.name === result.attack);
        if (attack === undefined) {
            throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        }
        return attack;
    }
    validate(result) {
        if (result === null) {
            return this.options.allowCancel; // operation cancelled
        }
        const blocked = this.options.blocked.map(b => {
            const card = this.cards[b.index];
            if (card && card.attacks) {
                return card.attacks.find(a => a.name === b.attack);
            }
        });
        if (blocked.includes(result)) {
            return false;
        }
        return this.cards.some(c => c.attacks.includes(result));
    }
}
