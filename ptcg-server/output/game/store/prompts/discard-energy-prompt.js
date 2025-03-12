"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscardEnergyPrompt = exports.DiscardEnergyPromptType = void 0;
const card_1 = require("../card/card");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const prompt_1 = require("./prompt");
const state_utils_1 = require("../state-utils");
const card_types_1 = require("../card/card-types");
exports.DiscardEnergyPromptType = 'Discard energy';
class DiscardEnergyPrompt extends prompt_1.Prompt {
    constructor(playerId, message, playerType, slots, filter, options) {
        super(playerId);
        this.message = message;
        this.playerType = playerType;
        this.slots = slots;
        this.filter = filter;
        this.type = exports.DiscardEnergyPromptType;
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
            // Verify card is an energy card
            if (card.superType !== card_types_1.SuperType.ENERGY) {
                throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
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
exports.DiscardEnergyPrompt = DiscardEnergyPrompt;
