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
exports.Replays = void 0;
const typeorm_1 = require("typeorm");
const services_1 = require("../services");
const controller_1 = require("./controller");
const errors_1 = require("../common/errors");
const storage_1 = require("../../storage");
const game_1 = require("../../game");
const utils_1 = require("../../utils");
const config_1 = require("../../config");
class Replays extends controller_1.Controller {
    async onList(req, res) {
        const userId = req.body.userId;
        const defaultPageSize = config_1.config.backend.defaultPageSize;
        const page = parseInt(req.params.page, 10) || 0;
        const pageSize = parseInt(req.params.pageSize, 10) || defaultPageSize;
        const [replayRows, total] = await storage_1.Replay.findAndCount({
            where: [
                { user: { id: userId } }
            ],
            order: { created: 'DESC', name: 'ASC' },
            skip: page * pageSize,
            take: pageSize
        });
        const userMap = await this.buildUserMap(replayRows);
        const replays = replayRows
            .map(replay => this.buildReplayInfo(replay, userMap));
        res.send({ ok: true, replays, total });
    }
    async onFind(req, res) {
        const body = req.body;
        const userId = req.body.userId;
        const defaultPageSize = config_1.config.backend.defaultPageSize;
        const page = parseInt(req.params.page, 10) || 0;
        const pageSize = parseInt(req.params.pageSize, 10) || defaultPageSize;
        const query = (body.query || '').trim();
        if (query === '') {
            return this.onList(req, res);
        }
        const escapedQuery = this.escapeLikeString(query);
        const [replayRows, total] = await storage_1.Replay.findAndCount({
            where: { name: typeorm_1.Like(`%${escapedQuery}%`), user: { id: userId } },
            order: { created: 'DESC', name: 'ASC' },
            skip: page * pageSize,
            take: pageSize
        });
        const userMap = await this.buildUserMap(replayRows);
        const replays = replayRows
            .map(replay => this.buildReplayInfo(replay, userMap));
        res.send({ ok: true, replays, total });
    }
    async onMatchGet(req, res) {
        const matchId = parseInt(req.params.id, 10);
        const entity = await storage_1.Match.findOne(matchId);
        if (entity === undefined) {
            res.send({ error: errors_1.ApiErrorEnum.GAME_INVALID_ID });
            return;
        }
        const base64 = new utils_1.Base64();
        const replayData = base64.encode(entity.replayData);
        res.send({ ok: true, replayData });
    }
    async onGet(req, res) {
        const userId = req.body.userId;
        const replayId = parseInt(req.params.id, 10);
        const entity = await storage_1.Replay.findOne(replayId, { relations: ['user'] });
        if (entity === undefined || entity.user.id !== userId) {
            res.send({ error: errors_1.ApiErrorEnum.REPLAY_INVALID });
            return;
        }
        const base64 = new utils_1.Base64();
        const replayData = base64.encode(entity.replayData);
        res.send({ ok: true, replayData });
    }
    async onSave(req, res) {
        const body = req.body;
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        const match = await storage_1.Match.findOne(body.id);
        if (match === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.GAME_INVALID_ID });
            return;
        }
        const gameReplay = new game_1.Replay({ indexEnabled: false });
        try {
            gameReplay.deserialize(match.replayData);
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.REPLAY_INVALID });
            return;
        }
        let replay = new storage_1.Replay();
        replay.user = user;
        replay.name = body.name.trim();
        replay.player1 = gameReplay.player1;
        replay.player2 = gameReplay.player2;
        replay.winner = gameReplay.winner;
        replay.created = gameReplay.created;
        replay.replayData = match.replayData;
        try {
            replay = await replay.save();
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.REPLAY_INVALID });
            return;
        }
        const userMap = await this.buildUserMap([replay]);
        const replayInfo = this.buildReplayInfo(replay, userMap);
        res.send({ ok: true, replay: replayInfo });
    }
    async onDelete(req, res) {
        const body = req.body;
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        const replay = await storage_1.Replay.findOne(body.id, { relations: ['user'] });
        if (replay === undefined || replay.user.id !== user.id) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.REPLAY_INVALID });
            return;
        }
        await replay.remove();
        res.send({ ok: true });
    }
    async onRename(req, res) {
        const body = req.body;
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        let replay = await storage_1.Replay.findOne(body.id, { relations: ['user'] });
        if (replay === undefined || replay.user.id !== user.id) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.REPLAY_INVALID });
            return;
        }
        try {
            replay.name = body.name.trim();
            replay = await replay.save();
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.REPLAY_INVALID });
            return;
        }
        res.send({ ok: true, replay: {
                id: replay.id,
                name: replay.name
            } });
    }
    async onImport(req, res) {
        const body = req.body;
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        const base64 = new utils_1.Base64();
        const gameReplay = new game_1.Replay({ indexEnabled: false });
        try {
            const replayData = base64.decode(body.replayData);
            gameReplay.deserialize(replayData);
            gameReplay.player1 = await this.syncReplayPlayer(gameReplay.player1);
            gameReplay.player2 = await this.syncReplayPlayer(gameReplay.player2);
            gameReplay.created = Date.now();
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.REPLAY_INVALID });
            return;
        }
        let replay = new storage_1.Replay();
        replay.user = user;
        replay.name = body.name.trim();
        replay.player1 = gameReplay.player1;
        replay.player2 = gameReplay.player2;
        replay.winner = gameReplay.winner;
        replay.created = gameReplay.created;
        try {
            replay.replayData = gameReplay.serialize();
            replay = await replay.save();
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.REPLAY_INVALID });
            return;
        }
        const userMap = await this.buildUserMap([replay]);
        const replayInfo = this.buildReplayInfo(replay, userMap);
        res.send({ ok: true, replay: replayInfo });
    }
    async syncReplayPlayer(player) {
        const name = String(player.name);
        const ranking = parseInt(String(player.ranking), 10);
        const userId = 0;
        const userRows = await storage_1.User.find({ where: { name: player.name } });
        if (userRows.length > 0) {
            const user = userRows[0];
            return {
                userId: user.id,
                name: user.name,
                ranking: user.ranking
            };
        }
        return { userId, name, ranking };
    }
    async buildUserMap(replays) {
        const userIds = [];
        replays.forEach(replay => {
            for (const id of [replay.player1.userId, replay.player2.userId]) {
                if (id !== undefined && !userIds.includes(id)) {
                    userIds.push(id);
                }
            }
        });
        const userMap = {};
        if (userIds.length > 0) {
            const userRows = await storage_1.User.find({
                where: { id: typeorm_1.In(userIds) }
            });
            userRows.forEach(user => {
                userMap[user.id] = user;
            });
        }
        return userMap;
    }
    buildReplayInfo(replay, userMap) {
        let user1 = userMap[replay.player1.userId];
        let user2 = userMap[replay.player2.userId];
        if (user1 === undefined) {
            user1 = new storage_1.User();
            user1.name = replay.player1.name;
            user1.ranking = replay.player1.ranking;
        }
        if (user2 === undefined) {
            user2 = new storage_1.User();
            user2.name = replay.player2.name;
            user2.ranking = replay.player2.ranking;
        }
        return {
            replayId: replay.id,
            name: replay.name,
            player1: this.buildUserInfo(user1),
            player2: this.buildUserInfo(user2),
            winner: replay.winner,
            created: replay.created
        };
    }
}
__decorate([
    controller_1.Get('/list/:page?/:pageSize?'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Replays.prototype, "onList", null);
__decorate([
    controller_1.Post('/list/:page?/:pageSize?'),
    services_1.AuthToken(),
    services_1.Validate({
        query: services_1.check().isString().required()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Replays.prototype, "onFind", null);
__decorate([
    controller_1.Get('/match/:id'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Replays.prototype, "onMatchGet", null);
__decorate([
    controller_1.Get('/get/:id'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Replays.prototype, "onGet", null);
__decorate([
    controller_1.Post('/save'),
    services_1.AuthToken(),
    services_1.Validate({
        name: services_1.check().minLength(3).maxLength(32),
        id: services_1.check().isNumber()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Replays.prototype, "onSave", null);
__decorate([
    controller_1.Post('/delete'),
    services_1.AuthToken(),
    services_1.Validate({
        id: services_1.check().isNumber()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Replays.prototype, "onDelete", null);
__decorate([
    controller_1.Post('/rename'),
    services_1.AuthToken(),
    services_1.Validate({
        id: services_1.check().isNumber(),
        name: services_1.check().minLength(3).maxLength(32),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Replays.prototype, "onRename", null);
__decorate([
    controller_1.Post('/import'),
    services_1.AuthToken(),
    services_1.Validate({
        name: services_1.check().minLength(3).maxLength(32),
        replayData: services_1.check().isString().required(),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Replays.prototype, "onImport", null);
exports.Replays = Replays;
