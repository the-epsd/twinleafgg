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
exports.Login = void 0;
const services_1 = require("../services");
const controller_1 = require("./controller");
const errors_1 = require("../common/errors");
const md5_1 = require("../../utils/md5");
const storage_1 = require("../../storage");
const rate_limit_1 = require("../common/rate-limit");
const config_1 = require("../../config");
class Login extends controller_1.Controller {
    constructor() {
        super(...arguments);
        this.rateLimit = rate_limit_1.RateLimit.getInstance();
    }
    async onRegister(req, res, next) {
        const body = req.body;
        if (config_1.config.backend.registrationEnabled === false) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.REGISTER_DISABLED });
            return;
        }
        if (this.rateLimit.isLimitExceeded(req.ip)) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.REQUESTS_LIMIT_REACHED });
            return;
        }
        if (process.env.SERVER_PASSWORD
            && process.env.SERVER_PASSWORD !== body.serverPassword) {
            this.rateLimit.increment(req.ip);
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.REGISTER_INVALID_SERVER_PASSWORD });
            return;
        }
        if (await storage_1.User.findOne({ name: body.name })) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.REGISTER_NAME_EXISTS });
            return;
        }
        if (await storage_1.User.findOne({ email: body.email })) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.REGISTER_EMAIL_EXISTS });
            return;
        }
        // Don't allow to create to many users
        this.rateLimit.increment(req.ip);
        const user = new storage_1.User();
        user.name = body.name;
        user.email = body.email;
        user.password = md5_1.Md5.init(body.password);
        user.registered = Date.now();
        await user.save();
        res.send({ ok: true });
    }
    async onLogin(req, res) {
        const body = req.body;
        const user = await storage_1.User.findOne({ name: body.name });
        if (this.rateLimit.isLimitExceeded(req.ip)) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.REQUESTS_LIMIT_REACHED });
            return;
        }
        if (user === undefined || user.password !== md5_1.Md5.init(body.password)) {
            this.rateLimit.increment(req.ip);
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.LOGIN_INVALID });
            return;
        }
        const token = services_1.generateToken(user.id);
        res.send({ ok: true, token, config: this.getServerConfig() });
    }
    async onRefreshToken(req, res) {
        const userId = req.body.userId;
        const token = services_1.generateToken(userId);
        res.send({ ok: true, token, config: this.getServerConfig() });
    }
    onLogout(req, res) {
        res.send({ ok: true });
    }
    onInfo(req, res) {
        res.send({ ok: true, config: this.getServerConfig() });
    }
    getServerConfig() {
        return {
            apiVersion: 2,
            defaultPageSize: config_1.config.backend.defaultPageSize,
            scansUrl: config_1.config.sets.scansUrl,
            avatarsUrl: config_1.config.backend.avatarsUrl,
            avatarFileSize: config_1.config.backend.avatarFileSize,
            avatarMinSize: config_1.config.backend.avatarMinSize,
            avatarMaxSize: config_1.config.backend.avatarMaxSize,
            replayFileSize: config_1.config.backend.replayFileSize
        };
    }
}
__decorate([
    controller_1.Post('/register'),
    services_1.Validate({
        name: services_1.check().isName(),
        email: services_1.check().isEmail(),
        password: services_1.check().isPassword()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], Login.prototype, "onRegister", null);
__decorate([
    controller_1.Post(''),
    services_1.Validate({
        name: services_1.check().isName(),
        password: services_1.check().isString()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Login.prototype, "onLogin", null);
__decorate([
    controller_1.Get('/refreshToken'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Login.prototype, "onRefreshToken", null);
__decorate([
    controller_1.Get('/logout'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Login.prototype, "onLogout", null);
__decorate([
    controller_1.Get('/info'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Login.prototype, "onInfo", null);
exports.Login = Login;
