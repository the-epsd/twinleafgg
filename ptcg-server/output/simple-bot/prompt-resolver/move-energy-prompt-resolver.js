"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveEnergyPromptResolver = void 0;
const game_1 = require("../../game");
const prompt_resolver_1 = require("./prompt-resolver");
const utils_1 = require("../../utils/utils");
class MoveEnergyPromptResolver extends prompt_resolver_1.PromptResolver {
    resolvePrompt(state, player, prompt) {
        if (prompt instanceof game_1.MoveEnergyPrompt) {
            const result = this.getPromptResult(state, prompt);
            return new game_1.ResolvePromptAction(prompt.id, result);
        }
    }
    getPromptResult(state, prompt) {
        const copy = utils_1.deepClone(state, [game_1.Card]);
        const fromItems = this.buildFromCardItems(copy, prompt);
        const max = prompt.options.max;
        const min = prompt.options.min;
        const result = [];
        let prevScore = this.getStateScore(state, prompt.playerId);
        let isNegative = false;
        while (fromItems.length > 0 && (!isNegative || result.length < min)) {
            const transfers = this.buildTransferItems(copy, prompt, fromItems);
            transfers.sort((a, b) => b.score - a.score);
            if (transfers.length === 0) {
                break;
            }
            const best = transfers[0];
            const fromIndex = fromItems.indexOf(best.fromItem);
            fromItems.splice(fromIndex, 1);
            if (best.score < prevScore) {
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
            const source = best.fromItem.fromCardList;
            const target = best.toCardList;
            const card = best.fromItem.card;
            source.moveCardTo(card, target);
            result.push(best);
            prevScore = best.score;
            if (max !== undefined && result.length >= max) {
                break;
            }
        }
        if (result.length === 0 && prompt.options.allowCancel) {
            return null;
        }
        if (result.length < min && prompt.options.allowCancel) {
            return null;
        }
        return this.translateItems(state, prompt, result);
    }
    translateItems(state, prompt, items) {
        const player = state.players.find(p => p.id === prompt.playerId);
        if (player === undefined) {
            return [];
        }
        return items.map(item => {
            const cardList = game_1.StateUtils.getTarget(state, player, item.fromItem.from);
            const card = cardList.cards[item.fromItem.cardIndex];
            return {
                from: item.fromItem.from,
                to: item.to,
                card
            };
        });
    }
    buildTransferItems(state, prompt, fromCardItems) {
        const results = [];
        fromCardItems.forEach(item => {
            const fromCardList = item.fromCardList;
            const cardTargets = this.getTargets(state, prompt, prompt.options.blockedTo);
            for (const cardTarget of cardTargets) {
                if (cardTarget.cardList !== fromCardList) {
                    fromCardList.moveCardTo(item.card, cardTarget.cardList);
                    results.push({
                        fromItem: item,
                        to: cardTarget.target,
                        toCardList: cardTarget.cardList,
                        score: this.getStateScore(state, prompt.playerId)
                    });
                    cardTarget.cardList.moveCardTo(item.card, fromCardList);
                }
            }
        });
        return results;
    }
    buildFromCardItems(state, prompt) {
        const fromCardItems = [];
        const fromTargets = this.getTargets(state, prompt, prompt.options.blockedFrom);
        fromTargets.forEach(fromTarget => {
            const blockedMap = prompt.options.blockedMap.find(b => {
                return b.source.player === fromTarget.target.player
                    && b.source.slot === fromTarget.target.slot
                    && b.source.index === fromTarget.target.index;
            });
            const blocked = blockedMap ? blockedMap.blocked : [];
            const cardList = new game_1.CardList();
            fromTarget.cardList.cards.forEach((card, index) => {
                if (!blocked.includes(index)) {
                    cardList.cards.push(card);
                }
            });
            cardList.cards = cardList.filter(prompt.filter);
            cardList.cards.forEach(card => {
                fromCardItems.push({
                    fromCardList: fromTarget.cardList,
                    from: fromTarget.target,
                    card: card,
                    cardIndex: fromTarget.cardList.cards.indexOf(card)
                });
            });
        });
        return fromCardItems;
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
                if (prompt.slots.includes(target.slot)) {
                    results.push({ target, cardList });
                }
            });
        }
        if (hasPlayer) {
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (prompt.slots.includes(target.slot)) {
                    results.push({ target, cardList });
                }
            });
        }
        const blockedList = blocked.map(b => game_1.StateUtils.getTarget(state, player, b));
        results = results.filter(i => !blockedList.includes(i.cardList));
        return results;
    }
}
exports.MoveEnergyPromptResolver = MoveEnergyPromptResolver;
