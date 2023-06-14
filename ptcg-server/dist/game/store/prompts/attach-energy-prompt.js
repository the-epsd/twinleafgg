import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
export const AttachEnergyPromptType = 'Attach energy';
export class AttachEnergyPrompt extends Prompt {
    constructor(playerId, message, cardList, playerType, slots, filter, options) {
        super(playerId);
        this.message = message;
        this.cardList = cardList;
        this.playerType = playerType;
        this.slots = slots;
        this.filter = filter;
        this.type = AttachEnergyPromptType;
        // Default options
        this.options = Object.assign({}, {
            allowCancel: true,
            min: 0,
            max: cardList.cards.length,
            blocked: [],
            blockedTo: [],
            sameTarget: false,
            differentTargets: false
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
            const cardList = this.cardList;
            const card = cardList.cards[t.index];
            transfers.push({ to: t.to, card });
        });
        return transfers;
    }
    validate(result) {
        if (result === null) {
            return this.options.allowCancel; // operation cancelled
        }
        if (result.length < this.options.min || result.length > this.options.max) {
            return false;
        }
        // Check if all targets are the same
        if (this.options.sameTarget && result.length > 1) {
            const t = result[0].to;
            const different = result.some(r => {
                return r.to.player !== t.player
                    || r.to.slot !== t.slot
                    || r.to.index !== t.index;
            });
            if (different) {
                return false;
            }
        }
        // Check if all selected targets are different
        if (this.options.differentTargets && result.length > 1) {
            for (let i = 0; i < result.length; i++) {
                const t = result[i].to;
                const index = result.findIndex(r => {
                    return r.to.player === t.player
                        && r.to.slot === t.slot
                        && r.to.index === t.index;
                });
                if (index !== i) {
                    return false;
                }
            }
        }
        return result.every(r => r.card !== undefined);
    }
}
