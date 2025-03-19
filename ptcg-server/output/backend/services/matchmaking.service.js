"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchmakingService = void 0;
const game_1 = require("../../game");
class MatchmakingService {
    constructor(core) {
        this.core = core;
        this.queue = [];
        this.CHECK_INTERVAL = 2000; // Check for matches every 2 seconds
        this.VALIDATE_INTERVAL = 30000; // Validate connections every 30 seconds
        this.MAX_QUEUE_TIME = 300000; // 5 minutes maximum in queue
        this.matchCheckInterval = setInterval(() => this.checkMatches(), this.CHECK_INTERVAL);
        this.validateInterval = setInterval(() => this.validateQueue(), this.VALIDATE_INTERVAL);
    }
    static getInstance(core) {
        if (!MatchmakingService.instance) {
            MatchmakingService.instance = new MatchmakingService(core);
        }
        return MatchmakingService.instance;
    }
    addToQueue(client, socketWrapper, format, deck) {
        try {
            // Remove if already in queue
            this.removeFromQueue(client);
            // Validate deck before adding to queue
            if (!Array.isArray(deck) || deck.length === 0) {
                throw new Error('Invalid deck');
            }
            this.queue.push({
                client,
                socketWrapper,
                format,
                deck,
                joinedAt: Date.now(),
                lastValidated: Date.now()
            });
            this.broadcastQueueUpdate();
        }
        catch (error) {
            console.error('[Matchmaking] Error adding player to queue:', error);
        }
    }
    removeFromQueue(client) {
        try {
            const wasInQueue = this.queue.some(p => p.client === client);
            this.queue = this.queue.filter(p => p.client !== client);
            if (wasInQueue) {
                console.log(`[Matchmaking] Player ${client.name} removed from queue`);
                this.broadcastQueueUpdate();
            }
        }
        catch (error) {
            console.error('[Matchmaking] Error removing player from queue:', error);
        }
    }
    getQueuedPlayers() {
        return this.queue.map(p => p.client.name);
    }
    isPlayerInQueue(client) {
        return this.queue.some(p => p.client === client);
    }
    broadcastQueueUpdate() {
        try {
            const players = this.getQueuedPlayers();
            this.queue.forEach(p => {
                try {
                    p.socketWrapper.emit('matchmaking:queueUpdate', { players });
                }
                catch (error) {
                    console.error(`[Matchmaking] Error broadcasting to player ${p.client.name}:`, error);
                }
            });
        }
        catch (error) {
            console.error('[Matchmaking] Error broadcasting queue update:', error);
        }
    }
    validateQueue() {
        try {
            const now = Date.now();
            const playersToRemove = [];
            // Check for stale connections or players who have been in queue too long
            this.queue.forEach(player => {
                // Remove if in queue too long
                if (now - player.joinedAt > this.MAX_QUEUE_TIME) {
                    console.log(`[Matchmaking] Player ${player.client.name} removed from queue - exceeded maximum queue time`);
                    playersToRemove.push(player.client);
                    return;
                }
                // Validate socket is still connected
                try {
                    const isConnected = player.socketWrapper.isConnected();
                    if (!isConnected) {
                        console.log(`[Matchmaking] Player ${player.client.name} removed from queue - socket disconnected`);
                        playersToRemove.push(player.client);
                    }
                    else {
                        player.lastValidated = now;
                    }
                }
                catch (error) {
                    console.error(`[Matchmaking] Error validating connection for ${player.client.name}:`, error);
                    playersToRemove.push(player.client);
                }
            });
            // Remove invalid players
            playersToRemove.forEach(client => {
                this.removeFromQueue(client);
            });
            // Send queue update if players were removed
            if (playersToRemove.length > 0) {
                this.broadcastQueueUpdate();
            }
        }
        catch (error) {
            console.error('[Matchmaking] Error validating queue:', error);
        }
    }
    checkMatches() {
        try {
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
                // Verify both players are still connected
                if (!player1.socketWrapper.isConnected() || !player2.socketWrapper.isConnected()) {
                    // Remove disconnected players
                    if (!player1.socketWrapper.isConnected()) {
                        this.removeFromQueue(player1.client);
                    }
                    if (!player2.socketWrapper.isConnected()) {
                        this.removeFromQueue(player2.client);
                    }
                    return;
                }
                try {
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
                        console.log(`[Matchmaking] Created game #${game.id} for ${player1.client.name} vs ${player2.client.name}`);
                        // Notify players
                        player1.socketWrapper.emit('matchmaking:gameCreated', { gameId: game.id });
                        player2.socketWrapper.emit('matchmaking:gameCreated', { gameId: game.id });
                        // Remove matched players from queue
                        this.removeFromQueue(player1.client);
                        this.removeFromQueue(player2.client);
                    }
                }
                catch (error) {
                    console.error('[Matchmaking] Error creating game:', error);
                    // Remove players from queue if there was an error
                    this.removeFromQueue(player1.client);
                    this.removeFromQueue(player2.client);
                }
            });
        }
        catch (error) {
            console.error('[Matchmaking] Error checking matches:', error);
        }
    }
    dispose() {
        try {
            if (this.matchCheckInterval) {
                clearInterval(this.matchCheckInterval);
            }
            if (this.validateInterval) {
                clearInterval(this.validateInterval);
            }
            // Clear queue on dispose
            this.queue = [];
        }
        catch (error) {
            console.error('[Matchmaking] Error disposing matchmaking service:', error);
        }
    }
}
exports.MatchmakingService = MatchmakingService;
