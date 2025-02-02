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
exports.Avatars = void 0;
const fs_1 = require("fs");
const util_1 = require("util");
const path_1 = require("path");
const jimp_1 = require("jimp");
const services_1 = require("../services");
const storage_1 = require("../../storage");
const controller_1 = require("./controller");
const errors_1 = require("../common/errors");
const config_1 = require("../../config");
const typeorm_1 = require("typeorm");
class Avatars extends controller_1.Controller {
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
    async onAdd(req, res, manager) {
        const body = req.body;
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        let avatar = new storage_1.Avatar();
        avatar.name = body.name.trim();
        avatar.user = user;
        try {
            avatar.fileName = await this.createAvatarFile(body.imageBase64);
        }
        catch (error) {
            res.status(400);
            res.send({
                error: errors_1.ApiErrorEnum.VALIDATION_INVALID_PARAM,
                param: 'imageBase64',
                message: error instanceof Error ? error.message : ''
            });
            return;
        }
        try {
            avatar = await manager.save(avatar);
            // Set default avatar, if previously not set
            if (!user.avatarFile) {
                await manager.update(storage_1.User, user.id, { avatarFile: avatar.fileName });
                user.avatarFile = avatar.fileName;
                this.core.emit(c => c.onUsersUpdate([user]));
            }
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.NAME_DUPLICATE });
            return;
        }
        res.send({ ok: true, avatar: {
                id: avatar.id,
                name: avatar.name,
                fileName: avatar.fileName
            } });
    }
    async onDelete(req, res, manager) {
        const body = req.body;
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId, { relations: ['avatars'] });
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        const avatar = await storage_1.Avatar.findOne(body.id, { relations: ['user'] });
        if (avatar === undefined || avatar.user.id !== user.id) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.AVATAR_INVALID });
            return;
        }
        await this.removeAvatarFile(avatar.fileName);
        await manager.remove(avatar);
        // Set new avatar if deleted the default one
        if (user.avatarFile === avatar.fileName) {
            const newAvatar = user.avatars.find(a => a.fileName !== avatar.fileName);
            const avatarFile = newAvatar ? newAvatar.fileName : '';
            await manager.update(storage_1.User, user.id, { avatarFile });
            user.avatarFile = avatarFile;
            this.core.emit(c => c.onUsersUpdate([user]));
        }
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
        let avatar = await storage_1.Avatar.findOne(body.id, { relations: ['user'] });
        if (avatar === undefined || avatar.user.id !== user.id) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.AVATAR_INVALID });
            return;
        }
        try {
            avatar.name = body.name.trim();
            avatar = await avatar.save();
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.NAME_DUPLICATE });
            return;
        }
        res.send({ ok: true, avatar: {
                id: avatar.id,
                name: avatar.name,
                fileName: avatar.fileName
            } });
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
            user = await user.save();
            this.core.emit(c => c.onUsersUpdate([user]));
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.AVATAR_INVALID });
            return;
        }
        res.send({ ok: true });
    }
    async removeAvatarFile(fileName) {
        const unlinkAsync = util_1.promisify(fs_1.unlink);
        const path = path_1.join(config_1.config.backend.avatarsDir, fileName);
        return unlinkAsync(path);
    }
    async createAvatarFile(imageData) {
        const base64pattern = /^data:image\/([a-zA-Z]*);base64,/;
        const base64Data = imageData.replace(base64pattern, '');
        const buf = Buffer.from(base64Data, 'base64');
        if (buf.length > config_1.config.backend.avatarFileSize) {
            throw new Error('Image size exceeded.');
        }
        const image = await jimp_1.read(buf);
        if (!image || !image.bitmap) {
            throw new Error('Could not decode image.');
        }
        const minSize = config_1.config.backend.avatarMinSize;
        const maxSize = config_1.config.backend.avatarMaxSize;
        if (image.bitmap.width < minSize || image.bitmap.height < minSize
            || image.bitmap.width > maxSize || image.bitmap.height > maxSize) {
            throw new Error('Invalid image size');
        }
        const extension = image.getExtension();
        const readDirAsync = util_1.promisify(fs_1.readdir);
        const files = await readDirAsync(config_1.config.backend.avatarsDir);
        let num = Math.round(10000 * Math.random());
        let fileName;
        let maxRetries = 1000;
        do {
            num++;
            if (num >= 10000) {
                num = 0;
            }
            maxRetries--;
            if (maxRetries === 0) {
                throw new Error('Could not generate a file name.');
            }
            fileName = String(num).padStart(5, '0') + '.' + extension;
        } while (files.includes(fileName));
        await image.writeAsync(path_1.join(config_1.config.backend.avatarsDir, fileName));
        return fileName;
    }
}
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
    controller_1.Post('/add'),
    services_1.AuthToken(),
    services_1.Validate({
        name: services_1.check().minLength(3).maxLength(32),
        imageBase64: services_1.check().required()
    }),
    typeorm_1.Transaction(),
    __param(2, typeorm_1.TransactionManager()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, typeorm_1.EntityManager]),
    __metadata("design:returntype", Promise)
], Avatars.prototype, "onAdd", null);
__decorate([
    controller_1.Post('/delete'),
    services_1.AuthToken(),
    services_1.Validate({
        id: services_1.check().isNumber()
    }),
    typeorm_1.Transaction(),
    __param(2, typeorm_1.TransactionManager()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, typeorm_1.EntityManager]),
    __metadata("design:returntype", Promise)
], Avatars.prototype, "onDelete", null);
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
], Avatars.prototype, "onRename", null);
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
