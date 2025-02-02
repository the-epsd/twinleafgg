"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoosePrizePrompt = exports.ChoosePrizePromptType = void 0;
const prompt_1 = require("./prompt");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
exports.ChoosePrizePromptType = 'Choose prize';
class ChoosePrizePrompt extends prompt_1.Prompt {
    constructor(playerId, message, options) {
        super(playerId);
        this.message = message;
        this.type = exports.ChoosePrizePromptType;
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
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
        }
        const targetPlayer = this.options.useOpponentPrizes
            ? state.players.find(p => p.id !== this.playerId)
            : player;
        if (targetPlayer === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
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
exports.ChoosePrizePrompt = ChoosePrizePrompt;
