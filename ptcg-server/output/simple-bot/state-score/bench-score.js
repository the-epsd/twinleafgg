"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BenchScore = void 0;
const score_1 = require("./score");
class BenchScore extends score_1.SimpleScore {
    getScore(state, playerId) {
        const player = this.getPlayer(state, playerId);
        const scores = this.options.scores.bench;
        let score = 0;
        player.bench.forEach(b => { score += this.getPokemonScoreBy(scores, b); });
        return score;
    }
}
exports.BenchScore = BenchScore;
