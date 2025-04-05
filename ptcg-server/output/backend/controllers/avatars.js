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
exports.Avatars = void 0;
const services_1 = require("../services");
const storage_1 = require("../../storage");
const controller_1 = require("./controller");
const errors_1 = require("../common/errors");
class Avatars extends controller_1.Controller {
    async onGetPredefined(req, res) {
        const predefinedAvatars = [
            { id: 2, name: 'gg', fileName: 'av_1.png' },
            { id: 3, name: 'um', fileName: 'av_2.png' },
            { id: 4, name: 'gr', fileName: 'av_3.png' },
        ];
        res.send({ ok: true, avatars: predefinedAvatars });
    }
    async onList(req, res) {
        const userId = parseInt(req.params.id, 10) || req.body.userId;
        const user = await storage_1.User.findOne(userId, { relations: ['avatars'] });
        if (user === undefined) {
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        const avatars = user.avatars.map(avatar => ({
            id: avatar.id,
            name: avatar.name,
            fileName: avatar.fileName
        }));
        res.send({ ok: true, avatars });
    }
    async onGet(req, res) {
        const avatarId = parseInt(req.params.id, 10);
        const avatar = await storage_1.Avatar.findOne(avatarId);
        if (avatar === undefined) {
            res.send({ error: errors_1.ApiErrorEnum.AVATAR_INVALID });
            return;
        }
        const avatarInfo = {
            id: avatar.id,
            name: avatar.name,
            fileName: avatar.fileName
        };
        res.send({ ok: true, avatar: avatarInfo });
    }
    async onFind(req, res) {
        const body = req.body;
        const avatars = await storage_1.Avatar.find({
            where: { user: { id: body.id }, name: body.name.trim() }
        });
        if (avatars.length !== 1) {
            res.send({ error: errors_1.ApiErrorEnum.AVATAR_INVALID });
            return;
        }
        const avatar = avatars[0];
        const avatarInfo = {
            id: avatar.id,
            name: avatar.name,
            fileName: avatar.fileName
        };
        res.send({ ok: true, avatar: avatarInfo });
    }
    async onMarkAsDefault(req, res) {
        const body = req.body;
        const userId = req.body.userId;
        let user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        // For predefined avatars, we just update the user's avatarFile
        if (body.id <= 10) { // Predefined avatars have IDs 1-10
            try {
                user.avatarFile = `predefined_${body.id}.png`;
                const savedUser = await user.save();
                if (savedUser) {
                    this.core.emit(c => c.onUsersUpdate([savedUser]));
                }
                res.send({ ok: true });
                return;
            }
            catch (error) {
                res.status(400);
                res.send({ error: errors_1.ApiErrorEnum.AVATAR_INVALID });
                return;
            }
        }
        // For user avatars, we need to check ownership
        const avatar = await storage_1.Avatar.findOne(body.id, { relations: ['user'] });
        if (avatar === undefined || avatar.user.id !== user.id) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.AVATAR_INVALID });
            return;
        }
        if (user.avatarFile === avatar.fileName) {
            res.send({ ok: true });
            return;
        }
        try {
            user.avatarFile = avatar.fileName;
            const savedUser = await user.save();
            if (savedUser) {
                this.core.emit(c => c.onUsersUpdate([savedUser]));
            }
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.AVATAR_INVALID });
            return;
        }
        res.send({ ok: true });
    }
}
__decorate([
    controller_1.Get('/predefined'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Avatars.prototype, "onGetPredefined", null);
__decorate([
    controller_1.Get('/list/:id?'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Avatars.prototype, "onList", null);
__decorate([
    controller_1.Get('/get/:id'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Avatars.prototype, "onGet", null);
__decorate([
    controller_1.Post('/find'),
    services_1.AuthToken(),
    services_1.Validate({
        id: services_1.check().isNumber(),
        name: services_1.check().minLength(3).maxLength(32)
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Avatars.prototype, "onFind", null);
__decorate([
    controller_1.Post('/markAsDefault'),
    services_1.AuthToken(),
    services_1.Validate({
        id: services_1.check().isNumber()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Avatars.prototype, "onMarkAsDefault", null);
exports.Avatars = Avatars;
