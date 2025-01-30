"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = void 0;
const add_player_action_1 = require("../store/actions/add-player-action");
const cleaner_task_1 = require("../tasks/cleaner-task");
const game_error_1 = require("../game-error");
const game_message_1 = require("../game-message");
const game_1 = require("./game");
const game_settings_1 = require("./game-settings");
const invite_player_action_1 = require("../store/actions/invite-player-action");
const messager_1 = require("./messager");
const ranking_calculator_1 = require("./ranking-calculator");
const utils_1 = require("../../utils");
const config_1 = require("../../config");
const card_types_1 = require("../store/card/card-types");
class Core {
    constructor() {
        this.clients = [];
        this.games = [];
        this.messager = new messager_1.Messager(this);
        const cleanerTask = new cleaner_task_1.CleanerTask(this);
        cleanerTask.startTasks();
        this.startRankingDecrease();
    }
    connect(client) {
        client.id = utils_1.generateId(this.clients);
        client.core = this;
        client.games = [];
        this.emit(c => c.onConnect(client));
        this.clients.push(client);
        return client;
    }
    disconnect(client) {
        const index = this.clients.indexOf(client);
        if (index === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_CLIENT_NOT_CONNECTED);
        }
        client.games.forEach(game => this.leaveGame(client, game));
        this.clients.splice(index, 1);
        client.core = undefined;
        this.emit(c => c.onDisconnect(client));
    }
    createGame(client, deck, gameSettings = new game_settings_1.GameSettings(), invited) {
        if (this.clients.indexOf(client) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_CLIENT_NOT_CONNECTED);
        }
        if (invited && this.clients.indexOf(invited) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_CLIENT_NOT_CONNECTED);
        }
        if (gameSettings.format === card_types_1.Format.RETRO) {
            gameSettings.rules.attackFirstTurn = true;
        }
        const game = new game_1.Game(this, utils_1.generateId(this.games), gameSettings);
        game.dispatch(client, new add_player_action_1.AddPlayerAction(client.id, client.name, deck));
        if (invited) {
            game.dispatch(client, new invite_player_action_1.InvitePlayerAction(invited.id, invited.name));
        }
        this.games.push(game);
        this.emit(c => c.onGameAdd(game));
        this.joinGame(client, game);
        if (invited) {
            this.joinGame(invited, game);
        }
        return game;
    }
    createGameWithDecks(client, deck, gameSettings = new game_settings_1.GameSettings(), client2, deck2) {
        if (this.clients.indexOf(client) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_CLIENT_NOT_CONNECTED);
        }
        if (gameSettings.format === card_types_1.Format.RETRO) {
            gameSettings.rules.attackFirstTurn = true;
        }
        const game = new game_1.Game(this, utils_1.generateId(this.games), gameSettings);
        game.dispatch(client, new add_player_action_1.AddPlayerAction(client.id, client.name, deck));
        game.dispatch(client, new add_player_action_1.AddPlayerAction(client2.id, client2.name, deck2));
        this.games.push(game);
        this.emit(c => c.onGameAdd(game));
        this.joinGame(client, game);
        this.joinGame(client2, game);
        return game;
    }
    joinGame(client, game) {
        if (this.clients.indexOf(client) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_CLIENT_NOT_CONNECTED);
        }
        if (this.games.indexOf(game) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_GAME_NOT_FOUND);
        }
        if (client.games.indexOf(game) === -1) {
            this.emit(c => c.onGameJoin(game, client));
            client.games.push(game);
            game.clients.push(client);
        }
    }
    deleteGame(game) {
        game.clients.forEach(client => {
            const index = client.games.indexOf(game);
            if (index !== -1) {
                client.games.splice(index, 1);
                this.emit(c => c.onGameLeave(game, client));
            }
        });
        const index = this.games.indexOf(game);
        if (index !== -1) {
            this.games.splice(index, 1);
            this.emit(c => c.onGameDelete(game));
        }
    }
    leaveGame(client, game) {
        if (this.clients.indexOf(client) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_CLIENT_NOT_CONNECTED);
        }
        if (this.games.indexOf(game) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_GAME_NOT_FOUND);
        }
        const gameIndex = client.games.indexOf(game);
        const clientIndex = game.clients.indexOf(client);
        if (clientIndex !== -1 && gameIndex !== -1) {
            client.games.splice(gameIndex, 1);
            game.clients.splice(clientIndex, 1);
            this.emit(c => c.onGameLeave(game, client));
            game.handleClientLeave(client);
        }
        // Delete game, if there are no more clients left in the game
        if (game.clients.length === 1) {
            this.deleteGame(game);
        }
        if (game.clients.length === 0) {
            this.deleteGame(game);
        }
    }
    emit(fn) {
        this.clients.forEach(fn);
    }
    startRankingDecrease() {
        const scheduler = utils_1.Scheduler.getInstance();
        const rankingCalculator = new ranking_calculator_1.RankingCalculator();
        scheduler.run(async () => {
            let users = await rankingCalculator.decreaseRanking();
            // Notify only about users which are currently connected
            const connectedUserIds = this.clients.map(c => c.user.id);
            users = users.filter(u => connectedUserIds.includes(u.id));
            this.emit(c => c.onUsersUpdate(users));
        }, config_1.config.core.rankingDecreaseIntervalCount);
    }
}
exports.Core = Core;
