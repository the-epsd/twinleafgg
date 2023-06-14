"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmPromptResolver = void 0;
const game_1 = require("../../game");
const prompt_resolver_1 = require("./prompt-resolver");
const confirm_prompt_1 = require("../../game/store/prompts/confirm-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
class ConfirmPromptResolver extends prompt_resolver_1.PromptResolver {
    resolvePrompt(state, player, prompt) {
        if (prompt instanceof confirm_prompt_1.ConfirmPrompt) {
            return new game_1.ResolvePromptAction(prompt.id, false);
        }
        if (prompt instanceof show_cards_prompt_1.ShowCardsPrompt) {
            if (prompt.message === game_1.GameMessage.SETUP_OPPONENT_NO_BASIC) {
                const result = player.hand.cards.length < 15 ? true : null;
                return new game_1.ResolvePromptAction(prompt.id, result);
            }
            return new game_1.ResolvePromptAction(prompt.id, true);
        }
    }
}
exports.ConfirmPromptResolver = ConfirmPromptResolver;
