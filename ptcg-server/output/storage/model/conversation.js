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
var Conversation_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const typeorm_1 = require("typeorm");
const message_1 = require("./message");
const user_1 = require("./user");
let Conversation = Conversation_1 = class Conversation extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.user1 = new user_1.User();
        this.user2 = new user_1.User();
    }
    static async findByUsers(user1, user2) {
        const conversations = await Conversation_1.find({
            relations: ['user1', 'user2'],
            where: [
                { user1: { id: user1.id }, user2: { id: user2.id } },
                { user1: { id: user2.id }, user2: { id: user1.id } }
            ]
        });
        if (conversations.length === 0) {
            const conversation = new Conversation_1();
            conversation.user1 = user1;
            conversation.user2 = user2;
            return conversation;
        }
        return conversations[0];
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Conversation.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_1.User),
    __metadata("design:type", user_1.User)
], Conversation.prototype, "user1", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_1.User),
    __metadata("design:type", user_1.User)
], Conversation.prototype, "user2", void 0);
__decorate([
    typeorm_1.OneToMany(type => message_1.Message, message => message.conversation),
    __metadata("design:type", Array)
], Conversation.prototype, "messages", void 0);
__decorate([
    typeorm_1.OneToOne(type => message_1.Message, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", message_1.Message)
], Conversation.prototype, "lastMessage", void 0);
Conversation = Conversation_1 = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique(['user1', 'user2'])
], Conversation);
exports.Conversation = Conversation;
