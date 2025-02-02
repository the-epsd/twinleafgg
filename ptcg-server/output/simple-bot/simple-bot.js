"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleBot = void 0;
const bot_client_1 = require("../game/bots/bot-client");
const simple_game_handler_1 = require("./simple-game-handler");
const simple_bot_definitions_1 = require("./simple-bot-definitions");
class SimpleBot extends bot_client_1.BotClient {
    constructor(name, options = {}) {
        super(name);
        this.gameHandlers = [];
        this.options = Object.assign({
            tactics: simple_bot_definitions_1.allSimpleTactics,
            promptResolvers: simple_bot_definitions_1.allPromptResolvers,
            scores: simple_bot_definitions_1.defaultStateScores,
            arbiter: simple_bot_definitions_1.defaultArbiterOptions
        }, options);
    }
    onConnect(client) { }
    onDisconnect(client) { }
    onUsersUpdate(users) {
        const me = users.find(u => u.id === this.user.id);
        if (me !== undefined) {
            this.user = me;
        }
    }
    onMessage(from, message) { }
    onMessageRead(user) { }
    onGameJoin(game, client) {
        if (client === this) {
            const state = game.state;
            this.addGameHandler(game);
            this.onStateChange(game, state);
        }
    }
    onGameLeave(game, client) {
        const gameHandler = this.gameHandlers.find(gh => gh.game === game);
        if (client === this && gameHandler !== undefined) {
            this.deleteGameHandler(gameHandler);
            return;
        }
    }
    onGameAdd(game) { }
    onGameDelete(game) { }
    onStateChange(game, state) {
        const gameHandler = this.gameHandlers.find(handler => handler.game === game);
        if (gameHandler !== undefined) {
            gameHandler.onStateChange(state);
        }
    }
    addGameHandler(game) {
        const gameHandler = new simple_game_handler_1.SimpleGameHandler(this, this.options, game, this.loadDeck());
        this.gameHandlers.push(gameHandler);
        return gameHandler;
    }
    deleteGameHandler(gameHandler) {
        const index = this.gameHandlers.indexOf(gameHandler);
        if (index !== -1) {
            this.gameHandlers.splice(index, 1);
        }
    }
}
exports.SimpleBot = SimpleBot;
