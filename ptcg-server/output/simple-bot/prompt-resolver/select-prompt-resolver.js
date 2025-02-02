"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectPromptResolver = void 0;
const game_1 = require("../../game");
const prompt_resolver_1 = require("./prompt-resolver");
const select_prompt_1 = require("../../game/store/prompts/select-prompt");
const game_message_1 = require("../../game/game-message");
class SelectPromptResolver extends prompt_resolver_1.PromptResolver {
    resolvePrompt(state, player, prompt) {
        if (prompt instanceof select_prompt_1.SelectPrompt) {
            const result = this.handleDiscardAllEnergiesPrompt(state, player, prompt);
            return new game_1.ResolvePromptAction(prompt.id, result || 0);
        }
    }
    handleDiscardAllEnergiesPrompt(state, player, prompt) {
        const values = [game_message_1.GameMessage.ALL_FIRE_ENERGIES, game_message_1.GameMessage.ALL_LIGHTNING_ENERGIES];
        // Different kind of the select message
        if (prompt.message !== game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD
            || prompt.values.length !== values.length
            || prompt.values.some((value, index) => value !== values[index])) {
            return undefined;
        }
        const energies = player.hand.cards.filter(c => c instanceof game_1.EnergyCard);
        const fire = energies.filter(e => e.provides.includes(game_1.CardType.FIRE));
        const lightning = energies.filter(e => e.provides.includes(game_1.CardType.LIGHTNING));
        if (lightning.length >= fire.length) {
            return 1;
        }
        return 0;
    }
}
exports.SelectPromptResolver = SelectPromptResolver;
