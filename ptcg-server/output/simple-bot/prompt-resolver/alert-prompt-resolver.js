"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertPromptResolver = void 0;
const game_1 = require("../../game");
const prompt_resolver_1 = require("./prompt-resolver");
const alert_prompt_1 = require("../../game/store/prompts/alert-prompt");
class AlertPromptResolver extends prompt_resolver_1.PromptResolver {
    resolvePrompt(state, player, prompt) {
        if (prompt instanceof alert_prompt_1.AlertPrompt) {
            return new game_1.ResolvePromptAction(prompt.id, true);
        }
    }
}
exports.AlertPromptResolver = AlertPromptResolver;
