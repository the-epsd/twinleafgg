"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const game_1 = require("../../game");
class MatchmakingService {
    constructor(core) {
        this.lobbies = new Map();
        this.playerFormat = new Map();
        this.queueUpdates = new events_1.EventEmitter();
        this.lobbyCache = new Map();
        this.core = core;
    }
    static getInstance(core) {
        if (!MatchmakingService.instance) {
            MatchmakingService.instance = new MatchmakingService(core);
        }
        return MatchmakingService.instance;
    }
    getLobby(format) {
        if (!this.lobbyCache.has(format)) {
            this.lobbyCache.set(format, this.lobbies.get(format) || []);
        }
        return this.lobbyCache.get(format) || [];
    }
    async addToQueue(userId, format, deck) {
        var _a;
        if (!this.lobbies.has(format)) {
            this.lobbies.set(format, []);
        }
        (_a = this.lobbies.get(format)) === null || _a === void 0 ? void 0 : _a.push([userId, deck]);
        this.playerFormat.set(userId, format);
        await this.emitLobbyUpdate(format);
        await this.checkForMatch(format);
    }
    removeFromQueue(userId) {
        const format = this.playerFormat.get(userId);
        if (format) {
            const lobby = this.lobbies.get(format);
            if (lobby) {
                const index = lobby.findIndex(l => l[0] === userId);
                if (index > -1) {
                    lobby.splice(index, 1);
                }
            }
            this.playerFormat.delete(userId);
            this.emitLobbyUpdate(format);
        }
    }
    checkForMatch(format) {
        console.log(`Checking for match in format: ${format}`);
        const lobby = this.lobbies.get(format);
        if (lobby && lobby.length >= 2) {
            console.log(`Found ${lobby.length} players in lobby for ${format}`);
            const player1 = lobby.shift();
            const player2 = lobby.shift();
            if (player1 && player2) {
                console.log('Attempting to create match for Player 1 & Player 2');
                this.createMatch(player1, player2, format);
            }
        }
        else {
            console.log(`Not enough players in lobby for ${format}`);
        }
        this.emitLobbyUpdate(format);
    }
    emitLobbyUpdate(format) {
        const lobby = this.lobbies.get(format) || [];
        this.queueUpdates.emit('matchmaking:lobbyUpdate', { format, players: lobby });
    }
    createMatch(player1, player2, format) {
        const player1Client = this.core.clients.find(client => client.id === player1[0]);
        const player2Client = this.core.clients.find(client => client.id === player2[0]);
        if (player1Client && player2Client) {
            const gameSettings = new game_1.GameSettings();
            gameSettings.format = format;
            if (gameSettings.format.toString() === 'GLC') {
                gameSettings.timeLimit = 1200;
            }
            const game = this.core.createGameWithDecks(player1Client, player1[1], gameSettings, player2Client, player2[1]);
            // // Use InvitePlayerAction to add the second player
            // game.dispatch(player1Client, new InvitePlayerAction(player2Client.id, player2Client.name));
            this.queueUpdates.emit('gameStarted', { format, gameId: game.id, players: [player1, player2] });
        }
        else {
            console.error('Error creating match: Player not found');
            this.addToQueue(player1[0], format, player1[1]);
            this.addToQueue(player2[0], format, player2[1]);
        }
    }
}
exports.default = MatchmakingService;
