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
        this.boundJoinQueue = this.joinQueue.bind(this);
        this.boundLeaveQueue = this.leaveQueue.bind(this);
        this.client = client;
        this.matchmakingService = matchmaking_service_1.default.getInstance(this.core);
        this.bindListeners();
    }
    bindListeners() {
        this.socket.addListener('matchmaking:joinQueue', this.boundJoinQueue);
        this.socket.addListener('matchmaking:leaveQueue', this.boundLeaveQueue);
    }
    onJoinQueue(from, message) {
        const messageInfo = this.buildMessageInfo(message);
        const user = core_socket_1.CoreSocket.buildUserInfo(from.user);
        this.socket.emit('message:received', { message: messageInfo, user });
    }
    onLeaveQueue(from) {
        this.socket.emit('matchmaking:left', { user: core_socket_1.CoreSocket.buildUserInfo(from.user) });
    }
    joinQueue(params, response) {
        if (!params.format) {
            response('error', errors_1.ApiErrorEnum.INVALID_FORMAT);
            return;
        }
        this.matchmakingService.addToQueue(this.client.id, params.format, params.deck);
        response('ok');
    }
    leaveQueue(params, response) {
        this.matchmakingService.removeFromQueue(this.client.id);
        response('ok');
    }
    destroy() {
        this.socket.socket.removeListener('matchmaking:joinQueue', this.boundJoinQueue);
        this.socket.socket.removeListener('matchmaking:leaveQueue', this.boundLeaveQueue);
        this.matchmakingService.removeFromQueue(this.client.id);
    }
    buildMessageInfo(message) {
        const messageInfo = {
            messageId: message.id,
            senderId: message.sender.id,
            created: message.created,
            text: message.text,
            isRead: message.isRead
        };
        return messageInfo;
    }
}
exports.MatchmakingSocket = MatchmakingSocket;
