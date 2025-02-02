import { Prompt } from './prompt';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
export const ChoosePrizePromptType = 'Choose prize';
export class ChoosePrizePrompt extends Prompt {
    constructor(playerId, message, options) {
        super(playerId);
        this.message = message;
        this.type = ChoosePrizePromptType;
        // Default options
        this.options = Object.assign({}, {
            count: 1,
            max: 1,
            blocked: [],
            allowCancel: false,
            isSecret: false,
            useOpponentPrizes: false
        }, options);
        this.options.max = this.options.count;
    }
    decode(result, state) {
        if (result === null) {
            return result;
        }
        const player = state.players.find(p => p.id === this.playerId);
        if (player === undefined) {
            throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        }
        const targetPlayer = this.options.useOpponentPrizes
            ? state.players.find(p => p.id !== this.playerId)
            : player;
        if (targetPlayer === undefined) {
            throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        }
        const prizes = targetPlayer.prizes.filter(p => p.cards.length > 0);
        return result.map(index => prizes[index]);
    }
    validate(result) {
        if (result === null) {
            return this.options.allowCancel;
        }
        if (result.length !== this.options.count) {
            return false;
        }
        const hasDuplicates = result.some((p, index) => {
            return result.indexOf(p) !== index;
        });
        if (hasDuplicates) {
            return false;
        }
        const hasEmpty = result.some(p => p.cards.length === 0);
        if (hasEmpty) {
            return false;
        }
        return true;
    }
}
