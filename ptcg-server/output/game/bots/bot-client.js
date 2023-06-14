"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotClient = void 0;
const card_manager_1 = require("../cards/card-manager");
const deck_analyser_1 = require("../cards/deck-analyser");
const game_error_1 = require("../game-error");
const game_message_1 = require("../game-message");
const storage_1 = require("../../storage");
class BotClient {
    constructor(name) {
        this.id = 0;
        this.games = [];
        this.user = new storage_1.User();
        this.user.name = name;
        this.name = name;
    }
    createGame(deck, gameSettings, invited) {
        if (this.core === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_BOT_NOT_INITIALIZED);
        }
        const game = this.core.createGame(this, deck, gameSettings, invited);
        return game;
    }
    async loadDeck() {
        const deckRows = await storage_1.Deck.find({
            user: { id: this.user.id },
            isValid: true
        });
        const decks = deckRows
            .map(d => JSON.parse(d.cards))
            .filter((cards) => this.validateDeck(cards));
        if (decks.length === 0) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_BOT_NO_DECK);
        }
        const num = Math.round(Math.random() * (decks.length - 1));
        return decks[num];
    }
    validateDeck(cards) {
        const cardManager = card_manager_1.CardManager.getInstance();
        if (cards.some(c => !cardManager.isCardDefined(c))) {
            return false;
        }
        const analyser = new deck_analyser_1.DeckAnalyser(cards);
        return analyser.isValid();
    }
}
exports.BotClient = BotClient;
