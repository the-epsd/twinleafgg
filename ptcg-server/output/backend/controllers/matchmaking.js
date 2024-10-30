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
exports.Matchmaking = void 0;
const services_1 = require("../services");
const matchmaking_service_1 = require("../services/matchmaking.service");
const controller_1 = require("./controller");
class Matchmaking extends controller_1.Controller {
    joinQueue(req, res) {
        const { format, userId } = req.body;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        matchmaking_service_1.default.getInstance(this.core).addToQueue(userId, format);
        res.status(200).json({ message: 'Joined queue successfully' });
    }
    ;
    leaveQueue(req, res) {
        const userId = req.body.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        matchmaking_service_1.default.getInstance(this.core).removeFromQueue(userId);
        res.status(200).json({ message: 'Left queue successfully' });
    }
    ;
}
__decorate([
    controller_1.Post('/join'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Matchmaking.prototype, "joinQueue", null);
__decorate([
    controller_1.Post('/leave'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Matchmaking.prototype, "leaveQueue", null);
exports.Matchmaking = Matchmaking;
