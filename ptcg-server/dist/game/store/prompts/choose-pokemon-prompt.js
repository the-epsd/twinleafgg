import { Prompt } from './prompt';
import { PlayerType, SlotType } from '../actions/play-card-action';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { StateUtils } from '../state-utils';
export const ChoosePokemonPromptType = 'Choose pokemon';
export class ChoosePokemonPrompt extends Prompt {
    constructor(playerId, message, playerType, slots, options) {
        super(playerId);
        this.message = message;
        this.playerType = playerType;
        this.slots = slots;
        this.type = ChoosePokemonPromptType;
        // Default options
        this.options = Object.assign({}, {
            min: 1,
            max: 1,
            allowCancel: true,
            blocked: []
        }, options);
    }
    decode(result, state) {
        if (result === null) {
            return result; // operation cancelled
        }
        const player = state.players.find(p => p.id === this.playerId);
        const opponent = state.players.find(p => p.id !== this.playerId);
        if (player === undefined || opponent === undefined) {
            throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        }
        return result.map(target => {
            const p = target.player === PlayerType.BOTTOM_PLAYER ? player : opponent;
            return target.slot === SlotType.ACTIVE ? p.active : p.bench[target.index];
        });
    }
    validate(result, state) {
        if (result === null) {
            return this.options.allowCancel;
        }
        if (result.length < this.options.min || result.length > this.options.max) {
            return false;
        }
        if (result.some(cardList => cardList.cards.length === 0)) {
            return false;
        }
        const player = state.players.find(p => p.id === this.playerId);
        if (player === undefined) {
            return false;
        }
        const blocked = this.options.blocked.map(b => StateUtils.getTarget(state, player, b));
        if (result.some(r => blocked.includes(r))) {
            return false;
        }
        return true;
    }
}
