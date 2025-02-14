"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchmakingSocket = void 0;
const errors_1 = require("../common/errors");
const matchmaking_service_1 = require("../services/matchmaking.service");
const core_socket_1 = require("./core-socket");
class MatchmakingSocket {
    constructor(client, socket, core) {
        this.socket = socket;
        this.core = core;
        this.isInQueue = false;
        this.client = client;
        this.matchmakingService = matchmaking_service_1.default.getInstance(this.core);
        // message socket listeners
        this.socket.addListener('matchmaking:joinQueue', this.joinQueue.bind(this));
        this.socket.addListener('matchmaking:leaveQueue', this.leaveQueue.bind(this));
        // Handle disconnects
        this.socket.addListener('disconnect', () => {
            if (this.isInQueue) {
                this.matchmakingService.removeFromQueue(this.client.id);
            }
        });
    }
    onJoinQueue(from, message) {
        try {
            const messageInfo = this.buildMessageInfo(message);
            const user = core_socket_1.CoreSocket.buildUserInfo(from.user);
            this.socket.emit('message:received', { message: messageInfo, user });
        }
        catch (error) {
            console.error('Error in onJoinQueue:', error);
        }
    }
    onLeaveQueue() {
        // Removed empty handler to prevent unnecessary socket events
    }
    async joinQueue(params, response) {
        try {
            if (!params || !params.format || !params.deck) {
                response('error', errors_1.ApiErrorEnum.INVALID_FORMAT);
                return;
            }
            // Prevent duplicate queue joins
            if (this.isInQueue) {
                response('error', errors_1.ApiErrorEnum.OPERATION_NOT_PERMITTED);
                return;
            }
            console.log(`Player ${this.client.id} joined queue for format: ${params.format}`);
            await this.matchmakingService.addToQueue(this.client.id, params.format, params.deck);
            this.isInQueue = true;
            response('ok');
        }
        catch (error) {
            console.error('Error in joinQueue:', error);
            response('error', errors_1.ApiErrorEnum.SOCKET_ERROR);
        }
    }
    async leaveQueue(params, response) {
        try {
            if (!this.isInQueue) {
                response('ok');
                return;
            }
            await this.matchmakingService.removeFromQueue(this.client.id);
            this.isInQueue = false;
            response('ok');
        }
        catch (error) {
            console.error('Error in leaveQueue:', error);
            response('error', errors_1.ApiErrorEnum.SOCKET_ERROR);
        }
    }
    buildMessageInfo(message) {
        if (!message) {
            throw new Error('Invalid message object');
        }
        return {
            messageId: message.id,
            senderId: message.sender.id,
            created: message.created,
            text: message.text,
            isRead: message.isRead
        };
    }
}
exports.MatchmakingSocket = MatchmakingSocket;
