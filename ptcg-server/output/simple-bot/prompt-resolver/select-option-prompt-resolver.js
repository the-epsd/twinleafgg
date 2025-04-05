"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectOptionPromptResolver = void 0;
const prompt_resolver_1 = require("./prompt-resolver");
class SelectOptionPromptResolver extends prompt_resolver_1.PromptResolver {
    resolvePrompt(state, player, prompt) {
        return undefined; // Let the player make the choice
    }
}
exports.SelectOptionPromptResolver = SelectOptionPromptResolver;
