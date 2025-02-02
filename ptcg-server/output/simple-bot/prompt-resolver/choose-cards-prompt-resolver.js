"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseCardsPromptResolver = void 0;
const game_1 = require("../../game");
const prompt_resolver_1 = require("./prompt-resolver");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class ChooseCardsPromptResolver extends prompt_resolver_1.PromptResolver {
    resolvePrompt(state, player, prompt) {
        if (prompt instanceof choose_cards_prompt_1.ChooseCardsPrompt) {
            let result = this.buildCardsToChoose(state, prompt);
            result = this.removeInvalidCards(prompt, result);
            if (result.length > prompt.options.max) {
                result.length = prompt.options.max;
            }
            if (result.length < prompt.options.min) {
                result = null;
            }
            return new game_1.ResolvePromptAction(prompt.id, result);
        }
    }
    removeInvalidCards(prompt, cards) {
        const result = [];
        // temporary remove min restriction for this prompt
        const minCopy = prompt.options.min;
        prompt.options.min = 0;
        // Add card by card to the results and check if it is still valid
        for (const card of cards) {
            if (prompt.validate([...result, card])) {
                result.push(card);
            }
        }
        prompt.options.min = minCopy;
        return result;
    }
    buildCardsToChoose(state, prompt) {
        const cardList = new game_1.CardList();
        cardList.cards = prompt.cards.cards.filter((card, index) => {
            return !prompt.options.blocked.includes(index);
        });
        const cards = cardList.filter(prompt.filter).map(card => {
            const score = this.stateScore.getCardScore(state, prompt.playerId, card);
            return { card, score };
        });
        cards.sort((a, b) => b.score - a.score);
        return cards.map(c => c.card);
    }
}
exports.ChooseCardsPromptResolver = ChooseCardsPromptResolver;
