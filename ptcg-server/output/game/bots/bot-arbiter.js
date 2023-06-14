"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotArbiter = exports.BotShuffleMode = exports.BotFlipMode = void 0;
const coin_flip_prompt_1 = require("../store/prompts/coin-flip-prompt");
const shuffle_prompt_1 = require("../store/prompts/shuffle-prompt");
const resolve_prompt_action_1 = require("../store/actions/resolve-prompt-action");
var BotFlipMode;
(function (BotFlipMode) {
    BotFlipMode[BotFlipMode["ALL_HEADS"] = 0] = "ALL_HEADS";
    BotFlipMode[BotFlipMode["ALL_TAILS"] = 1] = "ALL_TAILS";
    BotFlipMode[BotFlipMode["RANDOM"] = 2] = "RANDOM";
})(BotFlipMode = exports.BotFlipMode || (exports.BotFlipMode = {}));
var BotShuffleMode;
(function (BotShuffleMode) {
    BotShuffleMode[BotShuffleMode["NO_SHUFFLE"] = 0] = "NO_SHUFFLE";
    BotShuffleMode[BotShuffleMode["REVERSE"] = 1] = "REVERSE";
    BotShuffleMode[BotShuffleMode["RANDOM"] = 2] = "RANDOM";
})(BotShuffleMode = exports.BotShuffleMode || (exports.BotShuffleMode = {}));
class BotArbiter {
    constructor(options = {}) {
        this.flipCount = 0;
        this.options = Object.assign({
            flipMode: BotFlipMode.ALL_HEADS,
            shuffleMode: BotShuffleMode.NO_SHUFFLE
        }, options);
    }
    resolvePrompt(state, prompt) {
        const player = state.players.find(p => p.id === prompt.playerId);
        if (player === undefined) {
            return;
        }
        if (prompt instanceof shuffle_prompt_1.ShuffleDeckPrompt) {
            let result = [];
            switch (this.options.shuffleMode) {
                case BotShuffleMode.RANDOM:
                    result = this.shuffle(player.deck);
                    return new resolve_prompt_action_1.ResolvePromptAction(prompt.id, result);
                case BotShuffleMode.REVERSE:
                    for (let i = player.deck.cards.length - 1; i >= 0; i--) {
                        result.push(i);
                    }
                    return new resolve_prompt_action_1.ResolvePromptAction(prompt.id, result);
                default:
                    for (let i = 0; i < player.deck.cards.length; i++) {
                        result.push(i);
                    }
                    return new resolve_prompt_action_1.ResolvePromptAction(prompt.id, result);
            }
        }
        if (prompt instanceof coin_flip_prompt_1.CoinFlipPrompt) {
            this.flipCount += 1;
            let result = false;
            switch (this.options.flipMode) {
                case BotFlipMode.RANDOM:
                    result = Math.round(Math.random()) === 0;
                    return new resolve_prompt_action_1.ResolvePromptAction(prompt.id, result);
                case BotFlipMode.ALL_TAILS:
                    // Every 10th coin is opposite to avoid infinite loops.
                    result = (this.flipCount % 10 === 9) ? true : false;
                    return new resolve_prompt_action_1.ResolvePromptAction(prompt.id, result);
                default:
                    result = (this.flipCount % 10 === 9) ? false : true;
                    return new resolve_prompt_action_1.ResolvePromptAction(prompt.id, result);
            }
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
exports.BotArbiter = BotArbiter;
