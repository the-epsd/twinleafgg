"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveDamagePrompt = exports.MoveDamagePromptType = void 0;
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const prompt_1 = require("./prompt");
const play_card_action_1 = require("../actions/play-card-action");
const state_utils_1 = require("../state-utils");
exports.MoveDamagePromptType = 'Move damage';
class MoveDamagePrompt extends prompt_1.Prompt {
    constructor(playerId, message, playerType, slots, maxAllowedDamage, options) {
        super(playerId);
        this.message = message;
        this.playerType = playerType;
        this.slots = slots;
        this.maxAllowedDamage = maxAllowedDamage;
        this.type = exports.MoveDamagePromptType;
        // Default options
        this.options = Object.assign({}, {
            allowCancel: true,
            min: 0,
            max: undefined,
            blockedFrom: [],
            blockedTo: [],
            singleSourceTarget: false,
            singleDestinationTarget: false
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
        return result;
    }
    validate(result, state) {
        if (result === null) {
            return this.options.allowCancel; // operation cancelled
        }
        if (this.options.singleSourceTarget) {
            const sources = new Set(result.map(r => JSON.stringify(r.from)));
            if (sources.size > 1) {
                return false;
            }
        }
        if (this.options.singleDestinationTarget) {
            const destinations = new Set(result.map(r => JSON.stringify(r.to)));
            if (destinations.size > 1) {
                return false;
            }
        }
        if (result.length < this.options.min) {
            return false;
        }
        if (this.options.max !== undefined && result.length > this.options.max) {
            return false;
        }
        const player = state.players.find(p => p.id === this.playerId);
        if (player === undefined) {
            return false;
        }
        const blockedFrom = this.options.blockedFrom.map(b => state_utils_1.StateUtils.getTarget(state, player, b));
        const blockedTo = this.options.blockedTo.map(b => state_utils_1.StateUtils.getTarget(state, player, b));
        for (const r of result) {
            const from = state_utils_1.StateUtils.getTarget(state, player, r.from);
            if (from === undefined || blockedFrom.includes(from)) {
                return false;
            }
            const to = state_utils_1.StateUtils.getTarget(state, player, r.to);
            if (to === undefined || blockedTo.includes(to)) {
                return false;
            }
        }
        if (this.playerType !== play_card_action_1.PlayerType.ANY) {
            if (result.some(r => r.from.player !== this.playerType)
                || result.some(r => r.to.player !== this.playerType)) {
                return false;
            }
        }
        if (result.some(r => !this.slots.includes(r.from.slot))
            || result.some(r => !this.slots.includes(r.to.slot))) {
            return false;
        }
        return true;
    }
}
exports.MoveDamagePrompt = MoveDamagePrompt;
