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
exports.Game = void 0;
const services_1 = require("../services");
const controller_1 = require("./controller");
const errors_1 = require("../common/errors");
class Game extends controller_1.Controller {
    async onLogs(req, res) {
        const gameId = parseInt(req.params.id, 10);
        const game = this.core.games.find(g => g.id === gameId);
        if (game === undefined) {
            res.send({ error: errors_1.ApiErrorEnum.GAME_INVALID_ID });
            return;
        }
        const logs = game.state.logs;
        res.send({ ok: true, logs });
    }
    async onPlayerStats(req, res) {
        const gameId = parseInt(req.params.id, 10);
        const game = this.core.games.find(g => g.id === gameId);
        if (game === undefined) {
            res.send({ error: errors_1.ApiErrorEnum.GAME_INVALID_ID });
            return;
        }
        const playerStats = game.playerStats;
        res.send({ ok: true, playerStats });
    }
}
__decorate([
    controller_1.Get('/:id/logs'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Game.prototype, "onLogs", null);
__decorate([
    controller_1.Get('/:id/playerStats'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Game.prototype, "onPlayerStats", null);
exports.Game = Game;
