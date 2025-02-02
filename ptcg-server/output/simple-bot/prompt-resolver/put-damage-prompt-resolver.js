"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PutDamagePromptResolver = void 0;
const game_1 = require("../../game");
const prompt_resolver_1 = require("./prompt-resolver");
const put_damage_prompt_1 = require("../../game/store/prompts/put-damage-prompt");
class PutDamagePromptResolver extends prompt_resolver_1.PromptResolver {
    resolvePrompt(state, player, prompt) {
        if (prompt instanceof put_damage_prompt_1.PutDamagePrompt) {
            const result = this.getPutDamagePromptResult(state, prompt);
            return new game_1.ResolvePromptAction(prompt.id, result);
        }
    }
    getPutDamagePromptResult(state, prompt) {
        const items = this.getTargets(state, prompt, prompt.options.blocked);
        const result = [];
        let score = 0;
        let promptDamage = prompt.damage;
        while (items.length > 0 && promptDamage > 0) {
            const item = items.shift();
            if (item === undefined) {
                break;
            }
            const target = item.target;
            const hpLeft = item.hp - item.damage;
            const damage = Math.min(promptDamage, hpLeft);
            promptDamage -= damage;
            item.damage += damage;
            score += item.score * damage;
            result.push({ target, damage });
        }
        if (result.length === 0 && prompt.options.allowCancel) {
            return null;
        }
        if (score < 0 && prompt.options.allowCancel) {
            return null;
        }
        return result;
    }
    getTargets(state, prompt, blocked) {
        const player = state.players.find(p => p.id === prompt.playerId);
        const opponent = state.players.find(p => p.id !== prompt.playerId);
        if (player === undefined || opponent === undefined) {
            return [];
        }
        const hasOpponent = [game_1.PlayerType.TOP_PLAYER, game_1.PlayerType.ANY].includes(prompt.playerType);
        const hasPlayer = [game_1.PlayerType.BOTTOM_PLAYER, game_1.PlayerType.ANY].includes(prompt.playerType);
        let results = [];
        if (hasOpponent) {
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                const maxAllowedDamage = prompt.maxAllowedDamage.find(d => {
                    return d.target.player === target.player
                        && d.target.slot === target.slot
                        && d.target.index === target.index;
                });
                const hp = maxAllowedDamage ? maxAllowedDamage.damage : 0;
                const damage = cardList.damage;
                const score = this.stateScore.getPokemonScore(cardList);
                if (hp > 0 && prompt.slots.includes(target.slot)) {
                    results.push({ target, cardList, damage, hp, score });
                }
            });
        }
        if (hasPlayer) {
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const maxHp = prompt.maxAllowedDamage.find(d => {
                    return d.target.player === target.player
                        && d.target.slot === target.slot
                        && d.target.index === target.index;
                });
                const hp = maxHp ? maxHp.damage - cardList.damage : 0;
                const damage = cardList.damage;
                const score = -this.stateScore.getPokemonScore(cardList);
                if (hp > 0 && prompt.slots.includes(target.slot)) {
                    results.push({ target, cardList, damage, hp, score });
                }
            });
        }
        const blockedList = blocked.map(b => game_1.StateUtils.getTarget(state, player, b));
        results = results.filter(i => !blockedList.includes(i.cardList));
        results.sort((a, b) => b.score - a.score);
        return results;
    }
}
exports.PutDamagePromptResolver = PutDamagePromptResolver;
