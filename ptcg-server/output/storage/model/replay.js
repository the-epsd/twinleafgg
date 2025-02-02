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
exports.Replay = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const game_1 = require("../../game");
const bigint_1 = require("../transformers/bigint");
const blob_1 = require("../transformers/blob");
let Replay = class Replay extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.user = new user_1.User();
        this.name = '';
        this.player1 = { userId: 0, name: '', ranking: 0 };
        this.player2 = { userId: 0, name: '', ranking: 0 };
        this.winner = game_1.GameWinner.NONE;
        this.created = Date.now();
        this.replayData = '';
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Replay.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_1.User),
    __metadata("design:type", user_1.User)
], Replay.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Replay.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-json' }),
    __metadata("design:type", Object)
], Replay.prototype, "player1", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-json' }),
    __metadata("design:type", Object)
], Replay.prototype, "player2", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Replay.prototype, "winner", void 0);
__decorate([
    typeorm_1.Column({ type: 'bigint', transformer: [bigint_1.bigint] }),
    __metadata("design:type", Number)
], Replay.prototype, "created", void 0);
__decorate([
    typeorm_1.Column({ type: 'blob', transformer: [blob_1.blob] }),
    __metadata("design:type", String)
], Replay.prototype, "replayData", void 0);
Replay = __decorate([
    typeorm_1.Entity()
], Replay);
exports.Replay = Replay;
