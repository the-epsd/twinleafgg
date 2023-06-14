"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoosePokemonPrompt = exports.ChoosePokemonPromptType = void 0;
const prompt_1 = require("./prompt");
const play_card_action_1 = require("../actions/play-card-action");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const state_utils_1 = require("../state-utils");
exports.ChoosePokemonPromptType = 'Choose pokemon';
class ChoosePokemonPrompt extends prompt_1.Prompt {
    constructor(playerId, message, playerType, slots, options) {
        super(playerId);
        this.message = message;
        this.playerType = playerType;
        this.slots = slots;
        this.type = exports.ChoosePokemonPromptType;
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
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
        }
        return result.map(target => {
            const p = target.player === play_card_action_1.PlayerType.BOTTOM_PLAYER ? player : opponent;
            return target.slot === play_card_action_1.SlotType.ACTIVE ? p.active : p.bench[target.index];
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
        const blocked = this.options.blocked.map(b => state_utils_1.StateUtils.getTarget(state, player, b));
        if (result.some(r => blocked.includes(r))) {
            return false;
        }
        return true;
    }
}
exports.ChoosePokemonPrompt = ChoosePokemonPrompt;
