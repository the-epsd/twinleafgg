"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseAttackPrompt = exports.ChooseAttackPromptType = void 0;
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const prompt_1 = require("./prompt");
exports.ChooseAttackPromptType = 'Choose attack';
class ChooseAttackPrompt extends prompt_1.Prompt {
    constructor(playerId, message, cards, options) {
        super(playerId);
        this.message = message;
        this.cards = cards;
        this.type = exports.ChooseAttackPromptType;
        // Default options
        this.options = Object.assign({}, {
            allowCancel: false,
            blockedMessage: game_message_1.GameMessage.NOT_ENOUGH_ENERGY,
            blocked: []
        }, options);
    }
    decode(result, state) {
        if (result === null) {
            return result; // operation cancelled
        }
        const index = result.index;
        if (index < 0 || index >= this.cards.length) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
        }
        const card = this.cards[index];
        const attack = card.attacks.find(a => a.name === result.attack);
        if (attack === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
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
exports.ChooseAttackPrompt = ChooseAttackPrompt;
