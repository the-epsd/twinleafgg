"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arbiter = void 0;
const coin_flip_prompt_1 = require("../store/prompts/coin-flip-prompt");
const shuffle_prompt_1 = require("../store/prompts/shuffle-prompt");
const state_log_1 = require("../store/state/state-log");
const resolve_prompt_action_1 = require("../store/actions/resolve-prompt-action");
const game_message_1 = require("../game-message");
class Arbiter {
    constructor() { }
    resolvePrompt(state, prompt) {
        const player = state.players.find(p => p.id === prompt.playerId);
        if (player === undefined) {
            return;
        }
        if (prompt instanceof shuffle_prompt_1.ShuffleDeckPrompt) {
            const result = this.shuffle(player.deck);
            return new resolve_prompt_action_1.ResolvePromptAction(prompt.id, result);
        }
        if (prompt instanceof coin_flip_prompt_1.CoinFlipPrompt) {
            const result = Math.round(Math.random()) === 0;
            const message = result
                ? game_message_1.GameLog.LOG_PLAYER_FLIPS_HEADS
                : game_message_1.GameLog.LOG_PLAYER_FLIPS_TAILS;
            const log = new state_log_1.StateLog(message, { name: player.name });
            return new resolve_prompt_action_1.ResolvePromptAction(prompt.id, result, log);
        }
    }
    shuffle(cards) {
        const len = cards.cards.length;
        const order = [];
        for (let i = 0; i < len; i++) {
            order.push(i);
        }
        for (let i = 0; i < len; i++) {
            const position = Math.min(len - 1, Math.round(Math.random() * len));
            const tmp = order[i];
            order[i] = order[position];
            order[position] = tmp;
        }
        return order;
    }
}
exports.Arbiter = Arbiter;
