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
exports.MatchRecorder = void 0;
const typeorm_1 = require("typeorm");
const state_1 = require("../store/state/state");
const storage_1 = require("../../storage");
const ranking_calculator_1 = require("./ranking-calculator");
const replay_1 = require("./replay");
class MatchRecorder {
    constructor(core) {
        this.core = core;
        this.finished = false;
        this.ranking = new ranking_calculator_1.RankingCalculator();
        this.replay = new replay_1.Replay({ indexEnabled: false });
    }
    onStateChange(state) {
        if (this.finished) {
            return;
        }
        if (state.players.length >= 2) {
            this.updateClients(state);
        }
        if (state.phase !== state_1.GamePhase.WAITING_FOR_PLAYERS) {
            this.replay.appendState(state);
        }
        if (state.phase === state_1.GamePhase.FINISHED) {
            this.finished = true;
            if (state.winner !== state_1.GameWinner.NONE) {
                this.saveMatch(state);
            }
        }
    }
    async saveMatch(state, manager) {
        if (!this.client1 || !this.client2 || manager === undefined) {
            return;
        }
        const match = new storage_1.Match();
        match.player1 = this.client1.user;
        match.player2 = this.client2.user;
        match.winner = state.winner;
        match.created = Date.now();
        match.ranking1 = match.player1.ranking;
        match.ranking2 = match.player2.ranking;
        match.rankingStake1 = 0;
        match.rankingStake2 = 0;
        this.replay.setCreated(match.created);
        this.replay.player1 = this.buildReplayPlayer(match.player1);
        this.replay.player2 = this.buildReplayPlayer(match.player2);
        this.replay.winner = match.winner;
        match.replayData = this.replay.serialize();
        try {
            // Update ranking
            const users = this.ranking.calculateMatch(match, state);
            // Update match's ranking
            if (users.length >= 2) {
                match.rankingStake1 = users[0].ranking - match.ranking1;
                match.ranking1 = users[0].ranking;
                match.rankingStake2 = users[1].ranking - match.ranking2;
                match.ranking2 = users[1].ranking;
            }
            await manager.save(match);
            if (users.length >= 2) {
                for (const user of users) {
                    const update = { ranking: user.ranking, lastRankingChange: user.lastRankingChange };
                    await manager.update(storage_1.User, user.id, update);
                }
                this.core.emit(c => c.onUsersUpdate(users));
            }
        }
        catch (error) {
            console.error(error);
            return;
        }
    }
    updateClients(state) {
        const player1Id = state.players[0].id;
        const player2Id = state.players[1].id;
        if (this.client1 === undefined) {
            this.client1 = this.findClient(player1Id);
        }
        if (this.client2 === undefined) {
            this.client2 = this.findClient(player2Id);
        }
    }
    findClient(clientId) {
        return this.core.clients.find(c => c.id === clientId);
    }
    buildReplayPlayer(player) {
        return { userId: player.id, name: player.name, ranking: player.ranking };
    }
}
__decorate([
    typeorm_1.Transaction(),
    __param(1, typeorm_1.TransactionManager()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [state_1.State, typeorm_1.EntityManager]),
    __metadata("design:returntype", Promise)
], MatchRecorder.prototype, "saveMatch", null);
exports.MatchRecorder = MatchRecorder;
