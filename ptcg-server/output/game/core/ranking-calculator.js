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
    calculateMatch(match, state) {
        // Add state parameter and check turns
        if (state.turn < 2) {
            return [];
        }
        const player1 = match.player1;
        const player2 = match.player2;
        if (player1.id === player2.id) {
            return [];
        }
        const rank1 = player1.getRank();
        const rank2 = player2.getRank();
        const rankDifference = Math.abs(player2.ranking - player1.ranking);
        const kValue = rankDifference > 400 ? 75 : 50;
        const diff = Math.max(-400, Math.min(400, player2.ranking - player1.ranking));
        const winExp = 1.0 / (1 + Math.pow(10.0, diff / 500.0));
        let outcome;
        switch (match.winner) {
            case state_1.GameWinner.PLAYER_1:
                outcome = 1;
                break;
            case state_1.GameWinner.PLAYER_2:
                outcome = 0;
                break;
            default:
            case state_1.GameWinner.DRAW:
                outcome = 0.5;
                break;
        }
        const stake = kValue * (outcome - winExp);
        const rankMultiplier1 = this.getRankMultiplier(player1.ranking);
        const rankMultiplier2 = this.getRankMultiplier(player2.ranking);
        const diff1 = this.getRankingDiff(rank1, rank2, Math.round(stake * rankMultiplier1));
        const diff2 = this.getRankingDiff(rank1, rank2, Math.round(stake * rankMultiplier2));
        player1.ranking = Math.max(0, player1.ranking + diff1);
        player2.ranking = Math.max(0, player2.ranking - diff2);
        const today = Date.now();
        player1.lastRankingChange = today;
        player2.lastRankingChange = today;
        return [player1, player2];
    }
    getRankingDiff(rank1, rank2, diff) {
        const rankGap = Math.abs(this.getRankPoints(rank2) - this.getRankPoints(rank1));
        const sign = diff >= 0 ? 1 : -1;
        let scaleFactor = 1;
        if (rankGap >= 2000)
            scaleFactor = 2.75;
        else if (rankGap >= 1000)
            scaleFactor = 2.25;
        else if (rankGap >= 500)
            scaleFactor = 1.8;
        // Increased base minimum points
        const minPoints = 10;
        const maxPoints = 40;
        const adjustedDiff = Math.max(minPoints, Math.min(maxPoints * scaleFactor, Math.abs(diff)));
        return sign * adjustedDiff;
    }
    getRankMultiplier(rankPoints) {
        if (rankPoints <= 250)
            return 2.0;
        if (rankPoints <= 1000)
            return 1.5;
        if (rankPoints <= 2500)
            return 1.0;
        return 0.5;
    }
    getRankPoints(rank) {
        const rankLevel = backend_1.rankLevels.find(level => level.rank === rank);
        return rankLevel ? rankLevel.points : 0;
    }
    async decreaseRanking() {
        const rankingDecreaseRate = config_1.config.core.rankingDecraseRate;
        const oneDay = config_1.config.core.rankingDecraseTime;
        const today = Date.now();
        const yesterday = today - oneDay;
        const users = await storage_1.User.find({
            where: {
                lastRankingChange: typeorm_1.LessThan(yesterday),
                ranking: typeorm_1.MoreThan(0)
            }
        });
        users.forEach(user => {
            user.lastRankingChange = today;
            user.ranking = Math.floor(user.ranking * rankingDecreaseRate);
        });
        await storage_1.User.update({
            lastRankingChange: typeorm_1.LessThan(yesterday),
            ranking: typeorm_1.MoreThan(0)
        }, {
            lastRankingChange: today,
            ranking: () => `ROUND(${rankingDecreaseRate} * ranking - 0.5)`
        });
        return users;
    }
}
exports.RankingCalculator = RankingCalculator;
