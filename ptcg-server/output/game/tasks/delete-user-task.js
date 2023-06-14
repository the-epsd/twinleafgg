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
exports.DeleteUserTask = void 0;
const typeorm_1 = require("typeorm");
const util_1 = require("util");
const fs_1 = require("fs");
const path_1 = require("path");
const storage_1 = require("../../storage");
const config_1 = require("../../config");
class DeleteUserTask {
    constructor() { }
    async deleteUserFromDb(userId, manager) {
        if (manager === undefined) {
            return [];
        }
        // decks
        await manager.delete(storage_1.Deck, { user: { id: userId } });
        // replays
        await manager.delete(storage_1.Replay, { user: { id: userId } });
        // conversations
        await manager.delete(storage_1.Conversation, { user1: { id: userId } });
        await manager.delete(storage_1.Conversation, { user2: { id: userId } });
        // matches
        await manager.delete(storage_1.Match, { player1: { id: userId } });
        await manager.delete(storage_1.Match, { player2: { id: userId } });
        // avatars
        const avatars = await manager.find(storage_1.Avatar, { user: { id: userId } });
        await manager.delete(storage_1.Avatar, { user: { id: userId } });
        // user
        await manager.delete(storage_1.User, { id: userId });
        return avatars;
    }
    async deleteUser(userId) {
        const unlinkAsync = util_1.promisify(fs_1.unlink);
        try {
            // delete user with all dependencies
            const avatars = await this.deleteUserFromDb(userId);
            // remove avatar files from disk
            for (let i = 0; i < avatars.length; i++) {
                const path = path_1.join(config_1.config.backend.avatarsDir, avatars[i].fileName);
                await unlinkAsync(path);
            }
        }
        catch (error) {
            // continue regardless of error
        }
    }
}
__decorate([
    typeorm_1.Transaction(),
    __param(1, typeorm_1.TransactionManager()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeorm_1.EntityManager]),
    __metadata("design:returntype", Promise)
], DeleteUserTask.prototype, "deleteUserFromDb", null);
exports.DeleteUserTask = DeleteUserTask;
