"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSocket = void 0;
const core_socket_1 = require("./core-socket");
const storage_1 = require("../../storage");
const errors_1 = require("../common/errors");
class MessageSocket {
    constructor(client, socket, core) {
        this.socket = socket;
        this.core = core;
        this.client = client;
        // message socket listeners
        this.socket.addListener('message:send', this.sendMessage.bind(this));
        this.socket.addListener('message:read', this.readMessages.bind(this));
    }
    onMessage(from, message) {
        const messageInfo = this.buildMessageInfo(message);
        const user = core_socket_1.CoreSocket.buildUserInfo(from.user);
        this.socket.emit('message:received', { message: messageInfo, user });
    }
    onMessageRead(user) {
        this.socket.emit('message:read', { user: core_socket_1.CoreSocket.buildUserInfo(user) });
    }
    async sendMessage(params, response) {
        console.log(`Message from user ${this.client.id} to user ${params.userId}`);
        let messageInfo;
        let userInfo;
        const text = (params.text || '').trim();
        if (text.length === 0 || text.length > 2048) {
            response('error', errors_1.ApiErrorEnum.CANNOT_SEND_MESSAGE);
            return;
        }
        // Do not send message to yourself
        if (this.client.user.id === params.userId) {
            response('error', errors_1.ApiErrorEnum.CANNOT_SEND_MESSAGE);
            return;
        }
        try {
            const user = await storage_1.User.findOne(params.userId);
            if (user === undefined) {
                throw new Error(errors_1.ApiErrorEnum.PROFILE_INVALID);
            }
            const message = await this.core.messager.sendMessage(this.client, user, text);
            messageInfo = this.buildMessageInfo(message);
            userInfo = core_socket_1.CoreSocket.buildUserInfo(user);
        }
        catch (error) {
            response('error', errors_1.ApiErrorEnum.CANNOT_SEND_MESSAGE);
            return;
        }
        response('ok', { message: messageInfo, user: userInfo });
    }
    async readMessages(params, response) {
        try {
            const user = await storage_1.User.findOne(params.userId);
            if (user === undefined) {
                throw new Error(errors_1.ApiErrorEnum.PROFILE_INVALID);
            }
            await this.core.messager.readMessages(this.client, user);
        }
        catch (error) {
            response('error', errors_1.ApiErrorEnum.CANNOT_READ_MESSAGE);
            return;
        }
        response('ok');
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
exports.MessageSocket = MessageSocket;
