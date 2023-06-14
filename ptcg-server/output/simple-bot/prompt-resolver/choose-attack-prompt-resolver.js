"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseAttackPromptResolver = void 0;
const game_1 = require("../../game");
const prompt_resolver_1 = require("./prompt-resolver");
const choose_attack_prompt_1 = require("../../game/store/prompts/choose-attack-prompt");
class ChooseAttackPromptResolver extends prompt_resolver_1.PromptResolver {
    resolvePrompt(state, player, prompt) {
        if (prompt instanceof choose_attack_prompt_1.ChooseAttackPrompt) {
            const result = this.buildAttackToChoose(state, prompt);
            return new game_1.ResolvePromptAction(prompt.id, result);
        }
    }
    buildAttackToChoose(state, prompt) {
        const attacks = [];
        // Foul Play is banned, because when Zoroark meet's another Zoroak
        // they would copy theirs attacks in the infinite loop.
        const banned = state.phase === game_1.GamePhase.ATTACK
            ? ['Foul Play'] : [];
        prompt.cards.forEach((card, index) => {
            card.attacks.forEach(attack => {
                const isBlocked = prompt.options.blocked.some(b => {
                    return b.index === index && b.attack === attack.name;
                });
                if (!isBlocked && !banned.includes(attack.name)) {
                    attacks.push(attack);
                }
            });
        });
        attacks.sort((a, b) => {
            if (a.damage !== b.damage) {
                return b.damage - a.damage;
            }
            return b.cost.length - a.cost.length;
        });
        return attacks.length > 0 ? attacks[0] : null;
    }
}
exports.ChooseAttackPromptResolver = ChooseAttackPromptResolver;
