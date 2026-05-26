import { SimpleScore } from './score';
export class BenchScore extends SimpleScore {
    getScore(state, playerId) {
        const player = this.getPlayer(state, playerId);
        const scores = this.options.scores.bench;
        let score = 0;
        player.bench.forEach(b => { score += this.getPokemonScoreBy(scores, b); });
        return score;
    }
}
