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
        // Set up socket listeners
        this.socket.addListener('matchmaking:join', this.joinQueue.bind(this));
        this.socket.addListener('matchmaking:leave', this.leaveQueue.bind(this));
    }
    // Add these methods to match the Client interface expectations
    onJoinQueue(from, message) {
        // This method is called when another client joins the queue
        // You might want to update the UI or handle other logic
        this.socket.emit('matchmaking:playerJoined', {
            player: from.user.name
        });
    }
    onLeaveQueue() {
        // This method is called when another client leaves the queue
        // You might want to update the UI or handle other logic
        this.socket.emit('matchmaking:queueUpdate', {
            players: this.matchmakingService.getQueuedPlayers()
        });
    }
    joinQueue(params, response) {
        if (!params.format || !Array.isArray(params.deck)) {
            response('error', errors_1.ApiErrorEnum.INVALID_FORMAT);
            return;
        }
        try {
            this.matchmakingService.addToQueue(this.client, this.socket, params.format, params.deck);
            response('ok');
        }
        catch (error) {
            console.error('Error joining queue:', error);
            response('error', errors_1.ApiErrorEnum.SOCKET_ERROR);
        }
    }
    leaveQueue(_params, response) {
        try {
            this.matchmakingService.removeFromQueue(this.client);
            response('ok');
        }
        catch (error) {
            console.error('Error leaving queue:', error);
            response('error', errors_1.ApiErrorEnum.SOCKET_ERROR);
        }
    }
    dispose() {
        // Clean up when socket disconnects
        this.matchmakingService.removeFromQueue(this.client);
    }
}
exports.MatchmakingSocket = MatchmakingSocket;
