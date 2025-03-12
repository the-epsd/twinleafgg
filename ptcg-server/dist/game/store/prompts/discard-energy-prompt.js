import { Card } from '../card/card';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { StateUtils } from '../state-utils';
import { SuperType } from '../card/card-types';
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
            // Verify this is a card.
            if (!(card instanceof Card)) {
                throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
            }
            // Verify card is an energy card
            if (card.superType !== SuperType.ENERGY) {
                throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
            }
            transfers.push({ from: t.from, card });
        });
        return transfers;
    }
    validate(result) {
        if (result === null) {
            return this.options.allowCancel; // operation cancelled
        }
        if (result.length < this.options.min || (this.options.max !== undefined && result.length > this.options.max)) {
            return false;
        }
        return result.every(r => r.card !== undefined);
    }
}
