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
exports.ResetPassword = void 0;
const services_1 = require("../services");
const controller_1 = require("./controller");
const errors_1 = require("../common/errors");
const email_1 = require("../../email");
const md5_1 = require("../../utils/md5");
const storage_1 = require("../../storage");
const rate_limit_1 = require("../common/rate-limit");
const config_1 = require("../../config");
class ResetPassword extends controller_1.Controller {
    constructor() {
        super(...arguments);
        this.rateLimit = rate_limit_1.RateLimit.getInstance();
        this.mailer = new email_1.Mailer();
        this.tokens = [];
    }
    async onSendMail(req, res) {
        const body = req.body;
        if (this.rateLimit.isLimitExceeded(req.ip)) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.REQUESTS_LIMIT_REACHED });
            return;
        }
        // Don't allow to create to many reset-password requests
        this.rateLimit.increment(req.ip);
        const user = await storage_1.User.findOne({ email: body.email });
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.LOGIN_INVALID });
            return;
        }
        const token = this.generateToken(user.id);
        const language = body.language ? String(body.language) : 'en';
        const template = email_1.resetPasswordTemplates[language] || email_1.resetPasswordTemplates['en'];
        const params = {
            appName: config_1.config.email.appName,
            publicAddress: config_1.config.email.publicAddress,
            token
        };
        try {
            await this.mailer.sendEmail(body.email, template, params);
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.CANNOT_SEND_MESSAGE });
            return;
        }
        res.send({ ok: true });
    }
    async onChangePassword(req, res) {
        const body = req.body;
        const token = this.validateToken(body.token);
        if (token === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.LOGIN_INVALID });
            return;
        }
        const userId = token.userId;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
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
    generateToken(userId) {
        const now = Math.floor(Date.now() / 1000);
        this.tokens = this.tokens.filter(t => t.expire >= now);
        const random = Math.round(10000 * Math.random());
        const expire = now + config_1.config.backend.tokenExpire;
        const md5 = md5_1.Md5.init(process.env.secret + random);
        const hash = `${userId},${md5}`;
        this.tokens.push({ userId, expire, hash });
        return hash;
    }
    validateToken(hash) {
        if (typeof hash !== 'string') {
            return;
        }
        const now = Math.floor(Date.now() / 1000);
        this.tokens = this.tokens.filter(t => t.expire >= now);
        const index = this.tokens.findIndex(t => t.hash === hash);
        if (index !== -1) {
            const token = this.tokens[index];
            this.tokens.splice(index, 1);
            return token;
        }
    }
}
__decorate([
    controller_1.Post('/sendMail'),
    services_1.Validate({
        email: services_1.check().isEmail(),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResetPassword.prototype, "onSendMail", null);
__decorate([
    controller_1.Post('/changePassword'),
    services_1.Validate({
        token: services_1.check().isString().required(),
        newPassword: services_1.check().minLength(3).maxLength(32)
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResetPassword.prototype, "onChangePassword", null);
exports.ResetPassword = ResetPassword;
