"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchmakingSocket = void 0;
const errors_1 = require("../common/errors");
const matchmaking_service_1 = require("../services/matchmaking.service");
class MatchmakingSocket {
    constructor(client, socket, core) {
        this.client = client;
        this.socket = socket;
        this.core = core;
        this.matchmakingService = matchmaking_service_1.MatchmakingService.getInstance(this.core);
        this.socket.addListener('matchmaking:join', this.joinQueue.bind(this));
        this.socket.addListener('matchmaking:leave', this.leaveQueue.bind(this));
    }
    onJoinQueue(from, message) {
        try {
            if (!this.socket.isConnected()) {
                console.warn(`[Matchmaking] Cannot notify disconnected player ${this.client.name} about queue join`);
                return;
            }
            this.socket.emit('matchmaking:playerJoined', {
                player: from.user.name
            });
        }
        catch (error) {
            console.error(`[Matchmaking] Error notifying player about queue join: ${error.message || error}`);
        }
    }
    onLeaveQueue() {
        try {
            if (!this.socket.isConnected()) {
                console.warn(`[Matchmaking] Cannot update disconnected player ${this.client.name} about queue update`);
                return;
            }
            this.socket.emit('matchmaking:queueUpdate', {
                players: this.matchmakingService.getQueuedPlayers()
            });
        }
        catch (error) {
            console.error(`[Matchmaking] Error notifying player about queue update: ${error.message || error}`);
        }
    }
    joinQueue(params, response) {
        try {
            if (!params || !params.format || !Array.isArray(params.deck) || params.deck.length === 0) {
                console.warn(`[Matchmaking] Player ${this.client.name} tried to join queue with invalid parameters`);
                response('error', errors_1.ApiErrorEnum.INVALID_FORMAT);
                return;
            }
            if (!this.socket.isConnected()) {
                console.warn(`[Matchmaking] Player ${this.client.name} tried to join queue with disconnected socket`);
                response('error', errors_1.ApiErrorEnum.SOCKET_ERROR);
                return;
            }
            console.log(`[Matchmaking] Player ${this.client.name} joined queue for format: ${params.format}`);
            this.matchmakingService.addToQueue(this.client, this.socket, params.format, params.deck);
            response('ok');
        }
        catch (error) {
            console.error(`[Matchmaking] Error joining queue: ${error.message || error}`);
            response('error', errors_1.ApiErrorEnum.SOCKET_ERROR);
        }
    }
    leaveQueue(_params, response) {
        try {
            if (this.matchmakingService.isPlayerInQueue(this.client)) {
                console.log(`[Matchmaking] Player ${this.client.name} is leaving queue`);
                this.matchmakingService.removeFromQueue(this.client);
            }
            else {
                console.log(`[Matchmaking] Player ${this.client.name} tried to leave queue but wasn't in it`);
            }
            response('ok');
        }
        catch (error) {
            console.error(`[Matchmaking] Error leaving queue: ${error.message || error}`);
            response('error', errors_1.ApiErrorEnum.SOCKET_ERROR);
        }
    }
    dispose() {
        try {
            console.log(`[Matchmaking] Disposing socket for player ${this.client.name}`);
            if (this.matchmakingService.isPlayerInQueue(this.client)) {
                this.matchmakingService.removeFromQueue(this.client);
            }
        }
        catch (error) {
            console.error(`[Matchmaking] Error disposing matchmaking socket: ${error.message || error}`);
        }
    }
}
exports.MatchmakingSocket = MatchmakingSocket;
