import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { StateUtils } from '../state-utils';
export const DiscardEnergyPromptType = 'Discard energy';
export class DiscardEnergyPrompt extends Prompt {
    constructor(playerId, message, playerType, slots, filter, options) {
        super(playerId);
        this.message = message;
        this.playerType = playerType;
        this.slots = slots;
        this.filter = filter;
        this.type = DiscardEnergyPromptType;
        // Default options
        this.options = Object.assign({}, {
            allowCancel: true,
            min: 0,
            max: undefined,
            blockedFrom: [],
            blockedTo: [],
            blockedMap: [],
        }, options);
    }
    decode(result, state) {
        if (result === null) {
            return result; // operation cancelled
        }
        const player = state.players.find(p => p.id === this.playerId);
        if (player === undefined) {
            throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        }
        const transfers = [];
        result.forEach(t => {
            const cardList = StateUtils.getTarget(state, player, t.from);
            const card = cardList.cards[t.index];
            transfers.push({ from: t.from, to: t.to, card });
        });
        return transfers;
    }
    validate(result) {
        if (result === null) {
            return this.options.allowCancel; // operation cancelled
        }
        return result.every(r => r.card !== undefined);
    }
}
