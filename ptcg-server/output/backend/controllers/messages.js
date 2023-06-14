"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const services_1 = require("../services");
const controller_1 = require("./controller");
const storage_1 = require("../../storage");
const errors_1 = require("../common/errors");
const config_1 = require("../../config");
class Messages extends controller_1.Controller {
    async onList(req, res) {
        const userId = req.body.userId;
        const [conversationRows, total] = await this.db.manager.connection
            .getRepository(storage_1.Conversation)
            .createQueryBuilder('c')
            .innerJoinAndSelect('c.user1', 'user1')
            .innerJoinAndSelect('c.user2', 'user2')
            .innerJoinAndSelect('c.lastMessage', 'lastMessage')
            .innerJoinAndSelect('lastMessage.sender', 'sender')
            .where('c.user1 = :userId AND lastMessage.isDeletedByUser1 = false', { userId })
            .orWhere('c.user2 = :userId AND lastMessage.isDeletedByUser2 = false', { userId })
            .orderBy('lastMessage.created', 'DESC')
            .getManyAndCount();
        const users = [];
        conversationRows.forEach(c => {
            if (!users.some(u => u.userId === c.user1.id)) {
                users.push(this.buildUserInfo(c.user1));
            }
            if (!users.some(u => u.userId === c.user2.id)) {
                users.push(this.buildUserInfo(c.user2));
            }
        });
        const conversations = conversationRows.map(c => ({
            user1Id: c.user1.id,
            user2Id: c.user2.id,
            lastMessage: {
                messageId: c.lastMessage.id,
                senderId: c.lastMessage.sender.id,
                created: c.lastMessage.created,
                isRead: c.lastMessage.isRead,
                text: c.lastMessage.text
            }
        }));
        res.send({ ok: true, conversations, users, total });
    }
    async onGet(req, res) {
        const userId = req.body.userId;
        const defaultPageSize = config_1.config.backend.defaultPageSize;
        const page = parseInt(req.params.page, 10) || 0;
        const pageSize = parseInt(req.params.pageSize, 10) || defaultPageSize;
        const user1 = await storage_1.User.findOne(userId);
        const user2 = await storage_1.User.findOne(parseInt(req.params.id, 10));
        if (user1 === undefined || user2 === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        const conversation = await storage_1.Conversation.findByUsers(user1, user2);
        const users = [
            this.buildUserInfo(conversation.user1),
            this.buildUserInfo(conversation.user2)
        ];
        if (conversation.id === undefined) {
            res.send({ ok: true, messages: [], users, total: 0 });
            return;
        }
        const where = { conversation: { id: conversation.id } };
        if (conversation.user1.id === userId) {
            where.isDeletedByUser1 = false;
        }
        if (conversation.user2.id === userId) {
            where.isDeletedByUser2 = false;
        }
        const [messageRows, total] = await storage_1.Message.findAndCount({
            relations: ['sender'],
            where,
            order: { created: 'DESC' },
            skip: page * pageSize,
            take: pageSize
        });
        const messages = messageRows.map(m => ({
            messageId: m.id,
            senderId: m.sender.id,
            created: m.created,
            isRead: m.isRead,
            text: m.text
        }));
        res.send({ ok: true, messages, users, total });
    }
    async onDeleteMessages(req, res) {
        const userId = req.body.userId;
        const user1 = await storage_1.User.findOne(userId);
        const user2 = await storage_1.User.findOne(parseInt(req.body.id, 10));
        if (user1 === undefined || user2 === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        const conversation = await storage_1.Conversation.findByUsers(user1, user2);
        if (conversation.id === undefined) {
            res.send({ ok: true });
            return;
        }
        const updateValue = userId === conversation.user1.id
            ? { isDeletedByUser1: true }
            : { isDeletedByUser2: true };
        // Mark all messages as deleted for given user
        await storage_1.Message.update({ conversation: { id: conversation.id } }, updateValue);
        // Remove from database messages, if both are marked as deleted
        await storage_1.Message.delete({
            conversation: { id: conversation.id },
            isDeletedByUser1: true,
            isDeletedByUser2: true
        });
        res.send({ ok: true });
    }
}
__decorate([
    controller_1.Get('/list'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Messages.prototype, "onList", null);
__decorate([
    controller_1.Get('/get/:id'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Messages.prototype, "onGet", null);
__decorate([
    controller_1.Post('/deleteMessages'),
    services_1.AuthToken(),
    services_1.Validate({
        id: services_1.check().isNumber()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Messages.prototype, "onDeleteMessages", null);
exports.Messages = Messages;
