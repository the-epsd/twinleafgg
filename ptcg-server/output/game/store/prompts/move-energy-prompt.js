"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveEnergyPrompt = exports.MoveEnergyPromptType = void 0;
const card_1 = require("../card/card");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const prompt_1 = require("./prompt");
const state_utils_1 = require("../state-utils");
exports.MoveEnergyPromptType = 'Move energy';
class MoveEnergyPrompt extends prompt_1.Prompt {
    constructor(playerId, message, playerType, slots, filter, options) {
        super(playerId);
        this.message = message;
        this.playerType = playerType;
        this.slots = slots;
        this.filter = filter;
        this.type = exports.MoveEnergyPromptType;
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
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
        }
        const transfers = [];
        result.forEach(t => {
            const cardList = state_utils_1.StateUtils.getTarget(state, player, t.from);
            const card = cardList.cards[t.index];
            // Verify this is a card.
            if (!(card instanceof card_1.Card)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
            }
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
exports.MoveEnergyPrompt = MoveEnergyPrompt;
