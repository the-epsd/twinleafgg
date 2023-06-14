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
exports.Ranking = void 0;
const typeorm_1 = require("typeorm");
const services_1 = require("../services");
const controller_1 = require("./controller");
const storage_1 = require("../../storage");
const config_1 = require("../../config");
class Ranking extends controller_1.Controller {
    async onList(req, res) {
        const defaultPageSize = config_1.config.backend.defaultPageSize;
        const page = parseInt(req.params.page, 10) || 0;
        const pageSize = parseInt(req.params.pageSize, 10) || defaultPageSize;
        const [users, total] = await storage_1.User.findAndCount({
            order: { ranking: 'DESC', lastRankingChange: 'DESC', registered: 'ASC' },
            skip: page * pageSize,
            take: pageSize
        });
        let position = page * pageSize;
        const ranking = users.map(user => {
            position += 1;
            return {
                position,
                user: this.buildUserInfo(user)
            };
        });
        res.send({ ok: true, ranking, total });
    }
    async onFind(req, res) {
        const body = req.body;
        const defaultPageSize = config_1.config.backend.defaultPageSize;
        const page = parseInt(req.params.page, 10) || 0;
        const pageSize = parseInt(req.params.pageSize, 10) || defaultPageSize;
        const query = (body.query || '').trim();
        if (query === '') {
            return this.onList(req, res);
        }
        const escapedQuery = this.escapeLikeString(query);
        const [users, total] = await storage_1.User.findAndCount({
            where: { name: typeorm_1.Like(`%${escapedQuery}%`) },
            order: { ranking: 'DESC', lastRankingChange: 'DESC', registered: 'ASC' },
            skip: page * pageSize,
            take: pageSize
        });
        let position = page * pageSize;
        const ranking = users.map(user => {
            position += 1;
            return {
                position,
                user: this.buildUserInfo(user)
            };
        });
        res.send({ ok: true, ranking, total });
    }
}
__decorate([
    controller_1.Get('/list/:page?/:pageSize?'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Ranking.prototype, "onList", null);
__decorate([
    controller_1.Post('/list/:page?/:pageSize?'),
    services_1.AuthToken(),
    services_1.Validate({
        query: services_1.check().isString().required()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Ranking.prototype, "onFind", null);
exports.Ranking = Ranking;
