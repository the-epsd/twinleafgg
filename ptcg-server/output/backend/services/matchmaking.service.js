"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchmakingService = void 0;
const game_1 = require("../../game");
class MatchmakingService {
    constructor(core) {
        this.core = core;
        this.queue = [];
        this.matchCheckInterval = setInterval(() => this.checkMatches(), 2000);
    }
    static getInstance(core) {
        if (!MatchmakingService.instance) {
            MatchmakingService.instance = new MatchmakingService(core);
        }
        return MatchmakingService.instance;
    }
    addToQueue(client, socketWrapper, format, deck) {
        // Remove if already in queue
        this.removeFromQueue(client);
        this.queue.push({
            client,
            socketWrapper,
            format,
            deck,
            joinedAt: Date.now()
        });
        this.broadcastQueueUpdate();
    }
    removeFromQueue(client) {
        this.queue = this.queue.filter(p => p.client !== client);
        this.broadcastQueueUpdate();
    }
    getQueuedPlayers() {
        return this.queue.map(p => p.client.name);
    }
    broadcastQueueUpdate() {
        const players = this.getQueuedPlayers();
        this.queue.forEach(p => {
            p.socketWrapper.emit('matchmaking:queueUpdate', { players });
        });
    }
    checkMatches() {
        if (this.queue.length < 2)
            return;
        // Group players by format
        const formatGroups = new Map();
        this.queue.forEach(player => {
            const players = formatGroups.get(player.format) || [];
            players.push(player);
            formatGroups.set(player.format, players);
        });
        // Check each format group for potential matches
        formatGroups.forEach(players => {
            if (players.length < 2)
                return;
            // Sort by time in queue
            players.sort((a, b) => a.joinedAt - b.joinedAt);
            // Match first two players
            const player1 = players[0];
            const player2 = players[1];
            // Create game settings
            const gameSettings = {
                format: player1.format,
                timeLimit: 1800,
                rules: new game_1.Rules(),
                recordingEnabled: false
            };
            // Use createGameWithDecks instead of createGame
            const game = this.core.createGameWithDecks(player1.client, player1.deck, gameSettings, player2.client, player2.deck);
            if (game) {
                // Notify players
                player1.socketWrapper.emit('matchmaking:gameCreated', { gameId: game.id });
                player2.socketWrapper.emit('matchmaking:gameCreated', { gameId: game.id });
                // Remove matched players from queue
                this.removeFromQueue(player1.client);
                this.removeFromQueue(player2.client);
            }
        });
    }
    dispose() {
        if (this.matchCheckInterval) {
            clearInterval(this.matchCheckInterval);
        }
    }
}
exports.MatchmakingService = MatchmakingService;
