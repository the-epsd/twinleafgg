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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const avatar_1 = require("./avatar");
const deck_1 = require("./deck");
const replay_1 = require("./replay");
const rank_enum_1 = require("../../backend/interfaces/rank.enum");
const bigint_1 = require("../transformers/bigint");
let User = User_1 = class User extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.name = '';
        this.email = '';
        this.ranking = 0;
        this.password = '';
        this.registered = 0;
        this.lastSeen = 0;
        this.lastRankingChange = 0;
        this.avatarFile = '';
    }
    getRank() {
        let rank = rank_enum_1.rankLevels[0].rank;
        for (const level of rank_enum_1.rankLevels) {
            if (level.points > this.ranking) {
                break;
            }
            rank = level.rank;
        }
        return rank;
    }
    async updateLastSeen() {
        this.lastSeen = Date.now();
        await User_1.update(this.id, { lastSeen: this.lastSeen });
        return this;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], User.prototype, "ranking", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ type: 'bigint', transformer: [bigint_1.bigint] }),
    __metadata("design:type", Number)
], User.prototype, "registered", void 0);
__decorate([
    typeorm_1.Column({ type: 'bigint', transformer: [bigint_1.bigint] }),
    __metadata("design:type", Number)
], User.prototype, "lastSeen", void 0);
__decorate([
    typeorm_1.Column({ type: 'bigint', transformer: [bigint_1.bigint] }),
    __metadata("design:type", Number)
], User.prototype, "lastRankingChange", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "avatarFile", void 0);
__decorate([
    typeorm_1.OneToMany(type => deck_1.Deck, deck => deck.user),
    __metadata("design:type", Array)
], User.prototype, "decks", void 0);
__decorate([
    typeorm_1.OneToMany(type => avatar_1.Avatar, avatar => avatar.user),
    __metadata("design:type", Array)
], User.prototype, "avatars", void 0);
__decorate([
    typeorm_1.OneToMany(type => replay_1.Replay, replay => replay.user),
    __metadata("design:type", Array)
], User.prototype, "replays", void 0);
User = User_1 = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique(['name'])
], User);
exports.User = User;
