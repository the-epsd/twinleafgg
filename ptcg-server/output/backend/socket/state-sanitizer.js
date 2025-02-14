"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateSanitizer = void 0;
const alert_prompt_1 = require("../../game/store/prompts/alert-prompt");
const card_1 = require("../../game/store/card/card");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const utils_1 = require("../../utils");
class StateSanitizer {
    constructor(client, cache) {
        this.client = client;
        this.cache = cache;
        this.lastSanitizedState = new Map();
        this.lastSanitizedTime = new Map();
        this.SANITIZE_INTERVAL = 1000; // Only sanitize once per second per game
    }
    /**
     * Clear sensitive data, resolved prompts and old logs.
     * Returns cached sanitized state if called within SANITIZE_INTERVAL
     */
    sanitize(state, gameId) {
        const now = Date.now();
        const lastTime = this.lastSanitizedTime.get(gameId) || 0;
        // Return cached state if within interval
        if (now - lastTime < this.SANITIZE_INTERVAL) {
            const cachedState = this.lastSanitizedState.get(gameId);
            if (cachedState) {
                return cachedState;
            }
        }
        // Perform sanitization
        let sanitizedState = utils_1.deepClone(state, [card_1.Card]);
        sanitizedState = this.filterPrompts(sanitizedState);
        sanitizedState = this.removeLogs(sanitizedState, gameId);
        sanitizedState = this.hideSecretCards(sanitizedState);
        // Cache the result
        this.lastSanitizedState.set(gameId, sanitizedState);
        this.lastSanitizedTime.set(gameId, now);
        return sanitizedState;
    }
    hideSecretCards(state) {
        if (state.cardNames.length === 0) {
            return state;
        }
        this.getSecretCardLists(state).forEach(cardList => {
            cardList.cards = cardList.cards.map((c, i) => this.createUnknownCard(i));
        });
        return state;
    }
    createUnknownCard(index) {
        return {
            superType: card_types_1.SuperType.NONE,
            fullName: 'Unknown',
            name: 'Unknown',
            id: index
        };
    }
    getSecretCardLists(state) {
        const players = state.players.filter(p => p.id === this.client.id);
        const cardLists = [];
        players.forEach(player => {
            if (player.deck.isSecret) {
                cardLists.push(player.deck);
            }
            player.prizes.forEach(prize => {
                if (prize.isSecret) {
                    cardLists.push(prize);
                }
            });
        });
        const opponents = state.players.filter(p => p.id !== this.client.id);
        opponents.forEach(opponent => {
            if (!opponent.hand.isPublic) {
                cardLists.push(opponent.hand);
            }
            if (!opponent.deck.isPublic) {
                cardLists.push(opponent.deck);
            }
            opponent.prizes.forEach(prize => {
                if (!prize.isPublic) {
                    cardLists.push(prize);
                }
            });
        });
        state.prompts.forEach(prompt => {
            if (prompt instanceof choose_cards_prompt_1.ChooseCardsPrompt && prompt.options.isSecret) {
                cardLists.push(prompt.cards);
            }
        });
        return cardLists;
    }
    filterPrompts(state) {
        // Filter resolved prompts, not needed anymore
        state.prompts = state.prompts.filter(prompt => {
            return prompt.result === undefined;
        });
        // Hide opponent's prompts. They may contain sensitive data.
        state.prompts = state.prompts.map(prompt => {
            if (prompt.playerId !== this.client.id) {
                return new alert_prompt_1.AlertPrompt(prompt.playerId, game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            return prompt;
        });
        // Cards in the prompt are known, in the game cards are secret,
        // For example, serching for the cards from deck.
        // The method hideSecretCards would hide cards from prompt as well.
        state.prompts = utils_1.deepClone(state.prompts, [card_1.Card]);
        return state;
    }
    removeLogs(state, gameId) {
        // Remove logs, which were already send to client.
        const lastLogId = this.cache.lastLogIdCache[gameId];
        state.logs = state.logs.filter(log => log.id > lastLogId);
        if (state.logs.length > 0) {
            this.cache.lastLogIdCache[gameId] = state.logs[state.logs.length - 1].id;
        }
        return state;
    }
}
exports.StateSanitizer = StateSanitizer;
