"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoosePrizePromptResolver = void 0;
const game_1 = require("../../game");
const prompt_resolver_1 = require("./prompt-resolver");
const choose_prize_prompt_1 = require("../../game/store/prompts/choose-prize-prompt");
class ChoosePrizePromptResolver extends prompt_resolver_1.PromptResolver {
    resolvePrompt(state, player, prompt) {
        if (prompt instanceof choose_prize_prompt_1.ChoosePrizePrompt) {
            const result = player.prizes.filter(p => p.cards.length > 0)
                .slice(0, prompt.options.count);
            return new game_1.ResolvePromptAction(prompt.id, result);
        }
    }
}
exports.ChoosePrizePromptResolver = ChoosePrizePromptResolver;
