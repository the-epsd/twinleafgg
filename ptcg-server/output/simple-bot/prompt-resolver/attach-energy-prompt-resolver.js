"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachEnergyPromptResolver = void 0;
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const game_1 = require("../../game");
const prompt_resolver_1 = require("./prompt-resolver");
const utils_1 = require("../../utils/utils");
class AttachEnergyPromptResolver extends prompt_resolver_1.PromptResolver {
    resolvePrompt(state, player, prompt) {
        if (prompt instanceof attach_energy_prompt_1.AttachEnergyPrompt) {
            const result = this.getPromptResult(state, prompt);
            return new game_1.ResolvePromptAction(prompt.id, result);
        }
    }
    getPromptResult(state, prompt) {
        const copy = utils_1.deepClone(state, [game_1.Card]);
        const results = [];
        const baseScore = this.getStateScore(state, prompt.playerId);
        if (prompt.options.allowCancel) {
            results.push({ value: null, score: baseScore });
        }
        if (prompt.options.min === 0) {
            results.push({ value: [], score: baseScore });
        }
        const cardList = this.buildCardsToChoose(copy, prompt);
        const cards = cardList.cards.slice();
        let value = [];
        for (let i = 0; i < cards.length && i < prompt.options.max; i++) {
            const result = this.assignToBestTarget(copy, prompt, cardList, cards[i]);
            if (result === undefined || result.value === null) {
                break;
            }
            value = [...value, result.value[0]];
            results.push({ value, score: result.score });
        }
        results.sort((a, b) => b.score - a.score);
        return results.length > 0 ? results[0].value : null;
    }
    buildCardsToChoose(state, prompt) {
        const cardList = new game_1.CardList();
        cardList.cards = prompt.cardList.cards.filter((card, index) => {
            return !prompt.options.blocked.includes(index);
        });
        cardList.cards = cardList.filter(prompt.filter);
        return cardList;
    }
    assignToBestTarget(state, prompt, cardList, card) {
        const player = state.players.find(p => p.id === prompt.playerId);
        const opponent = state.players.find(p => p.id !== prompt.playerId);
        if (player === undefined || opponent === undefined) {
            return;
        }
        const hasOpponent = [game_1.PlayerType.TOP_PLAYER, game_1.PlayerType.ANY].includes(prompt.playerType);
        const hasPlayer = [game_1.PlayerType.BOTTOM_PLAYER, game_1.PlayerType.ANY].includes(prompt.playerType);
        let results = [];
        if (hasOpponent) {
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (prompt.slots.includes(target.slot)) {
                    results.push({ target, cardList, score: 0 });
                }
            });
        }
        if (hasPlayer) {
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (prompt.slots.includes(target.slot)) {
                    results.push({ target, cardList, score: 0 });
                }
            });
        }
        const blocked = prompt.options.blockedTo.map(b => game_1.StateUtils.getTarget(state, player, b));
        results = results.filter(i => !blocked.includes(i.cardList));
        if (results.length === 0) {
            return;
        }
        // evaluate results
        for (const result of results) {
            cardList.moveCardTo(card, result.cardList);
            result.score = this.getStateScore(state, player.id);
            result.cardList.moveCardTo(card, cardList);
        }
        results.sort((a, b) => b.score - a.score);
        const result = results[0];
        cardList.moveCardTo(card, result.cardList);
        return { value: [{ to: result.target, card }], score: result.score };
    }
}
exports.AttachEnergyPromptResolver = AttachEnergyPromptResolver;
