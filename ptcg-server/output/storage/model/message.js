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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const typeorm_1 = require("typeorm");
const conversation_1 = require("./conversation");
const user_1 = require("./user");
const bigint_1 = require("../transformers/bigint");
let Message = class Message extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.conversation = new conversation_1.Conversation();
        this.sender = new user_1.User();
        this.created = Date.now();
        this.isRead = false;
        this.isDeletedByUser1 = false;
        this.isDeletedByUser2 = false;
        this.text = '';
    }
    async send(receiver, manager) {
        if (manager === undefined) {
            return;
        }
        const conversation = await conversation_1.Conversation.findByUsers(this.sender, receiver);
        if (conversation.id === undefined) {
            await manager.save(conversation);
        }
        this.conversation = conversation;
        await manager.save(this);
        conversation.lastMessage = this;
        await manager.save(conversation);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Message.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => conversation_1.Conversation, conversation => conversation.messages, { onDelete: 'CASCADE' }),
    __metadata("design:type", conversation_1.Conversation)
], Message.prototype, "conversation", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_1.User),
    __metadata("design:type", user_1.User)
], Message.prototype, "sender", void 0);
__decorate([
    typeorm_1.Column({ type: 'bigint', transformer: [bigint_1.bigint] }),
    __metadata("design:type", Number)
], Message.prototype, "created", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Message.prototype, "isRead", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Message.prototype, "isDeletedByUser1", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Message.prototype, "isDeletedByUser2", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Message.prototype, "text", void 0);
__decorate([
    typeorm_1.Transaction(),
    __param(1, typeorm_1.TransactionManager()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User, typeorm_1.EntityManager]),
    __metadata("design:returntype", Promise)
], Message.prototype, "send", null);
Message = __decorate([
    typeorm_1.Entity()
], Message);
exports.Message = Message;
