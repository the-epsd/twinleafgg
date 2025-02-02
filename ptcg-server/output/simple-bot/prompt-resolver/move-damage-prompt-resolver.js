"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveDamagePromptResolver = void 0;
const game_1 = require("../../game");
const put_damage_prompt_resolver_1 = require("./put-damage-prompt-resolver");
class MoveDamagePromptResolver extends put_damage_prompt_resolver_1.PutDamagePromptResolver {
    resolvePrompt(state, player, prompt) {
        if (prompt instanceof game_1.MoveDamagePrompt) {
            const result = this.getMoveDamagePromptResult(state, prompt);
            return new game_1.ResolvePromptAction(prompt.id, result);
        }
    }
    getMoveDamagePromptResult(state, prompt) {
        let fromItems = this.getTargets(state, prompt, prompt.options.blockedFrom);
        const toItems = this.getTargets(state, prompt, prompt.options.blockedTo);
        fromItems.reverse();
        fromItems = fromItems.filter(i => i.cardList.damage);
        const result = [];
        let score = 0;
        let isNegative = false;
        const min = prompt.options.min;
        const max = prompt.options.max;
        let fromIndex = 0;
        let toIndex = 0;
        while (fromIndex < fromItems.length && toIndex < toItems.length && (!isNegative || result.length < min)) {
            const fromItem = fromItems[fromIndex];
            const toItem = toItems[toIndex];
            if (fromItem === undefined || toItem === undefined) {
                break;
            }
            if (fromItem.score >= toItem.score) {
                isNegative = true;
            }
            // Moving any card gives negative score, and we are able to cancel
            // Don't append any results, just cancel the prompt
            if (isNegative && prompt.options.allowCancel) {
                break;
            }
            // Score is negative, and we already have minimum transfers
            if (isNegative && result.length >= min) {
                break;
            }
            if (toItem.cardList === fromItem.cardList) {
                toIndex += 1;
            }
            if (toItem.cardList !== fromItem.cardList) {
                fromItem.damage -= 10;
                toItem.damage += 10;
                score += toItem.score - fromItem.score;
                result.push({ from: fromItem.target, to: toItem.target });
                if (fromItem.damage <= 0) {
                    fromIndex += 1;
                }
                if (toItem.hp - toItem.damage <= 0) {
                    toIndex += 1;
                }
                if (max !== undefined && result.length >= max) {
                    break;
                }
            }
        }
        if (result.length === 0 && prompt.options.allowCancel) {
            return null;
        }
        if (score < 0 && prompt.options.allowCancel) {
            return null;
        }
        return result;
    }
}
exports.MoveDamagePromptResolver = MoveDamagePromptResolver;
