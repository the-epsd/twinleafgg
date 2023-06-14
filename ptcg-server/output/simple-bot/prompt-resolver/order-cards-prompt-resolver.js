"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCardsPromptResolver = void 0;
const game_1 = require("../../game");
const prompt_resolver_1 = require("./prompt-resolver");
const order_cards_prompt_1 = require("../../game/store/prompts/order-cards-prompt");
class OrderCardsPromptResolver extends prompt_resolver_1.PromptResolver {
    resolvePrompt(state, player, prompt) {
        if (prompt instanceof order_cards_prompt_1.OrderCardsPrompt) {
            if (prompt.options.allowCancel) {
                return new game_1.ResolvePromptAction(prompt.id, null);
            }
            const cards = prompt.cards.cards.map((card, index) => {
                const score = this.stateScore.getCardScore(state, player.id, card);
                return { card, score, index };
            });
            cards.sort((a, b) => b.score - a.score);
            const result = cards.map(c => c.index);
            return new game_1.ResolvePromptAction(prompt.id, result);
        }
    }
}
exports.OrderCardsPromptResolver = OrderCardsPromptResolver;
