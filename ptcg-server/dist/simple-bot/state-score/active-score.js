import { SimpleScore } from './score';
export class ActiveScore extends SimpleScore {
    getScore(state, playerId) {
        const player = this.getPlayer(state, playerId);
        return this.getPokemonScoreBy(this.options.scores.active, player.active);
    }
}
