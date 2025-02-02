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
exports.Profile = void 0;
const services_1 = require("../services");
const controller_1 = require("./controller");
const errors_1 = require("../common/errors");
const md5_1 = require("../../utils/md5");
const storage_1 = require("../../storage");
const config_1 = require("../../config");
class Profile extends controller_1.Controller {
    async onMe(req, res) {
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        const userInfo = this.buildUserInfo(user);
        res.send({ ok: true, user: userInfo });
    }
    async onGet(req, res) {
        const userId = parseInt(req.params.id, 10);
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        const userInfo = this.buildUserInfo(user);
        res.send({ ok: true, user: userInfo });
    }
    async onMatchHistory(req, res) {
        const defaultPageSize = config_1.config.backend.defaultPageSize;
        const userId = parseInt(req.params.userId, 10) || 0;
        const page = parseInt(req.params.page, 10) || 0;
        const pageSize = parseInt(req.params.pageSize, 10) || defaultPageSize;
        const where = userId === 0 ? []
            : [{ player1: { id: userId } }, { player2: { id: userId } }];
        const [matchRows, total] = await storage_1.Match.findAndCount({
            relations: ['player1', 'player2'],
            where,
            order: { created: 'DESC' },
            skip: page * pageSize,
            take: pageSize
        });
        const users = [];
        matchRows.forEach(match => {
            [match.player1, match.player2].forEach(player => {
                if (!users.some(u => u.userId === player.id)) {
                    users.push(this.buildUserInfo(player));
                }
            });
        });
        const matches = matchRows
            .map(match => ({
            matchId: match.id,
            player1Id: match.player1.id,
            player2Id: match.player2.id,
            ranking1: match.ranking1,
            rankingStake1: match.rankingStake1,
            ranking2: match.ranking2,
            rankingStake2: match.rankingStake2,
            winner: match.winner,
            created: match.created
        }));
        res.send({ ok: true, matches, users, total });
    }
    async onChangePassword(req, res) {
        const userId = req.body.userId;
        const body = req.body;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined || user.password !== md5_1.Md5.init(body.currentPassword)) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.LOGIN_INVALID });
            return;
        }
        user.password = md5_1.Md5.init(body.newPassword);
        try {
            await user.save();
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.LOGIN_INVALID });
            return;
        }
        res.send({ ok: true });
    }
    async onChangeEmail(req, res) {
        const userId = req.body.userId;
        const body = req.body;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.LOGIN_INVALID });
            return;
        }
        if (user.email === body.email) {
            res.send({ ok: true });
            return;
        }
        if (await storage_1.User.findOne({ email: body.email })) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.REGISTER_EMAIL_EXISTS });
            return;
        }
        try {
            user.email = body.email;
            await user.save();
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.LOGIN_INVALID });
            return;
        }
        res.send({ ok: true });
    }
}
__decorate([
    controller_1.Get('/me'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Profile.prototype, "onMe", null);
__decorate([
    controller_1.Get('/get/:id'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Profile.prototype, "onGet", null);
__decorate([
    controller_1.Get('/matchHistory/:userId/:page?/:pageSize?'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Profile.prototype, "onMatchHistory", null);
__decorate([
    controller_1.Post('/changePassword'),
    services_1.AuthToken(),
    services_1.Validate({
        currentPassword: services_1.check().isPassword(),
        newPassword: services_1.check().isPassword()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Profile.prototype, "onChangePassword", null);
__decorate([
    controller_1.Post('/changeEmail'),
    services_1.AuthToken(),
    services_1.Validate({
        email: services_1.check().isEmail(),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Profile.prototype, "onChangeEmail", null);
exports.Profile = Profile;
