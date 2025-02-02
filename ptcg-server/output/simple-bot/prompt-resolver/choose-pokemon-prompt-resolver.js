"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoosePokemonPromptResolver = void 0;
const game_1 = require("../../game");
const prompt_resolver_1 = require("./prompt-resolver");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class ChoosePokemonPromptResolver extends prompt_resolver_1.PromptResolver {
    resolvePrompt(state, player, prompt) {
        if (prompt instanceof choose_pokemon_prompt_1.ChoosePokemonPrompt) {
            const items = this.buildPokemonToChoose(state, prompt);
            const result = this.getPromptResult(prompt, items);
            return new game_1.ResolvePromptAction(prompt.id, result);
        }
    }
    getPromptResult(prompt, pokemons) {
        const items = pokemons.map(item => {
            const score = this.getPokemonScoreForPrompt(prompt, item);
            return { cardList: item.cardList, score };
        });
        items.sort((a, b) => b.score - a.score);
        const result = [];
        const min = prompt.options.min;
        const max = prompt.options.max;
        let score = 0;
        while (items.length > 0 && (items[0].score > 0 || result.length < min)) {
            const item = items.shift();
            if (item === undefined) {
                break;
            }
            result.push(item.cardList);
            score += item.score;
            if (result.length >= max) {
                break;
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
    getPokemonScoreForPrompt(prompt, item) {
        let score = this.stateScore.getPokemonScore(item.cardList);
        if (item.player === game_1.PlayerType.TOP_PLAYER) {
            score = -score;
        }
        // reverse messages
        const weakestMessages = [
            game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD,
            game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
            game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP
        ];
        if (weakestMessages.includes(prompt.message)) {
            score = -score;
        }
        return score;
    }
    buildPokemonToChoose(state, prompt) {
        const player = state.players.find(p => p.id === prompt.playerId);
        const opponent = state.players.find(p => p.id !== prompt.playerId);
        if (player === undefined || opponent === undefined) {
            return [];
        }
        const hasOpponent = [game_1.PlayerType.TOP_PLAYER, game_1.PlayerType.ANY].includes(prompt.playerType);
        const hasPlayer = [game_1.PlayerType.BOTTOM_PLAYER, game_1.PlayerType.ANY].includes(prompt.playerType);
        const hasBench = prompt.slots.includes(game_1.SlotType.BENCH);
        const hasActive = prompt.slots.includes(game_1.SlotType.ACTIVE);
        let result = [];
        if (hasOpponent && hasBench) {
            opponent.bench.filter(b => b.cards.length).forEach(b => {
                result.push({ cardList: b, player: game_1.PlayerType.TOP_PLAYER });
            });
        }
        if (hasOpponent && hasActive) {
            result.push({ cardList: opponent.active, player: game_1.PlayerType.TOP_PLAYER });
        }
        if (hasPlayer && hasActive) {
            result.push({ cardList: player.active, player: game_1.PlayerType.BOTTOM_PLAYER });
        }
        if (hasPlayer && hasBench) {
            player.bench.filter(b => b.cards.length).forEach(b => {
                result.push({ cardList: b, player: game_1.PlayerType.BOTTOM_PLAYER });
            });
        }
        const blocked = prompt.options.blocked.map(b => game_1.StateUtils.getTarget(state, player, b));
        result = result.filter(r => !blocked.includes(r.cardList));
        return result;
    }
}
exports.ChoosePokemonPromptResolver = ChoosePokemonPromptResolver;
