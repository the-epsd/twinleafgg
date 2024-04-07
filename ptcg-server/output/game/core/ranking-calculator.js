"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingCalculator = void 0;
const storage_1 = require("../../storage");
const typeorm_1 = require("typeorm");
const state_1 = require("../store/state/state");
const backend_1 = require("../../backend");
const config_1 = require("../../config");
class RankingCalculator {
    constructor() { }
    calculateMatch(match) {
        const player1 = match.player1;
        const player2 = match.player2;
        if (player1.id === player2.id) {
            return [];
        }
        const rank1 = player1.getRank();
        const rank2 = player2.getRank();
        const kValue = 50;
        const totalDiff = player2.ranking - player1.ranking;
        const diff = Math.max(-400, Math.min(400, totalDiff));
        const winExp = 1.0 / (1 + Math.pow(10.0, diff / 400.0));
        let outcome;
        let rankMultipier1 = 1;
        let rankMultipier2 = 1;
        switch (match.winner) {
            case state_1.GameWinner.PLAYER_1:
                outcome = 1;
                rankMultipier1 = this.getRankMultipier(rank1);
                break;
            case state_1.GameWinner.PLAYER_2:
                rankMultipier2 = this.getRankMultipier(rank2);
                outcome = 0;
                break;
            default:
            case state_1.GameWinner.DRAW:
                outcome = 0.5;
                break;
        }
        const stake = kValue * (outcome - winExp);
        const diff1 = this.getRankingDiff(rank1, rank2, Math.round(stake * rankMultipier1));
        const diff2 = this.getRankingDiff(rank1, rank2, Math.round(stake * rankMultipier2));
        player1.ranking = Math.max(0, player1.ranking + diff1);
        player2.ranking = Math.max(0, player2.ranking - diff2);
        const today = Date.now();
        player1.lastRankingChange = today;
        player2.lastRankingChange = today;
        return [player1, player2];
    }
    getRankingDiff(rank1, rank2, diff) {
        const sign = diff >= 0;
        let value = Math.abs(diff);
        // Maximum ranking change for different ranks = 10
        if (rank1 !== rank2 && value > 10) {
            value = 10;
        }
        // Minimum ranking change = 5
        if (value < 5) {
            value = 5;
        }
        return sign ? value : -value;
    }
    getRankMultipier(rank) {
        switch (rank) {
            case backend_1.Rank.JUNIOR:
                return 2.0;
            case backend_1.Rank.SENIOR:
                return 1.0;
            case backend_1.Rank.ULTRA:
                return 0.75;
            case backend_1.Rank.MASTER:
                return 0.5;
        }
        return 1;
    }
    async decreaseRanking() {
        const rankingDecraseRate = config_1.config.core.rankingDecraseRate;
        const oneDay = config_1.config.core.rankingDecraseTime;
        const today = Date.now();
        const yesterday = today - oneDay;
        const users = await storage_1.User.find({ where: {
                lastRankingChange: typeorm_1.LessThan(yesterday),
                ranking: typeorm_1.MoreThan(0)
            } });
        // calculate new ranking in the server
        users.forEach(user => {
            user.lastRankingChange = today;
            user.ranking = Math.floor(user.ranking * rankingDecraseRate);
        });
        // execute update query in the database
        // sqlite doesn't support FLOOR, so we use ROUND(x - 0.5)
        await storage_1.User.update({
            lastRankingChange: typeorm_1.LessThan(yesterday),
            ranking: typeorm_1.MoreThan(0)
        }, {
            lastRankingChange: today,
            ranking: () => `ROUND(${rankingDecraseRate} * ranking - 0.5)`
        });
        // is it wise to emit all users to all connected clients by websockets?
        return users;
    }
}
exports.RankingCalculator = RankingCalculator;
