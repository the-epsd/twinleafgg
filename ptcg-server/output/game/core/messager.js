"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messager = void 0;
const storage_1 = require("../../storage");
class Messager {
    constructor(core) {
        this.core = core;
    }
    async sendMessage(client, receiver, text) {
        const time = Date.now();
        const message = new storage_1.Message();
        message.sender = client.user;
        message.created = time;
        message.text = text;
        await message.send(receiver);
        this.core.clients.forEach(c => {
            if (c.user.id === receiver.id) {
                c.onMessage(client, message);
            }
        });
        return message;
    }
    async readMessages(client, conversationUser) {
        const conversation = await storage_1.Conversation.findByUsers(client.user, conversationUser);
        if (conversation.id === undefined) {
            return;
        }
        // Mark all messages as deleted for given user
        await storage_1.Message.update({
            conversation: { id: conversation.id },
            sender: { id: conversationUser.id },
        }, {
            isRead: true
        });
        this.core.clients.forEach(c => {
            if (c.user.id === conversationUser.id) {
                c.onMessageRead(client.user);
            }
        });
    }
}
exports.Messager = Messager;
