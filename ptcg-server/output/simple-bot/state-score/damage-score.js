"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamageScore = void 0;
const game_1 = require("../../game");
const score_1 = require("./score");
class DamageScore extends score_1.SimpleScore {
    getScore(state, playerId) {
        const player = this.getPlayer(state, playerId);
        const opponent = game_1.StateUtils.getOpponent(state, player);
        let pokemonScoreSum = 0;
        let score = 0;
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            const [pokemonScores, multipier] = target.slot === game_1.SlotType.ACTIVE
                ? [this.options.scores.active, this.options.scores.damage.playerActive]
                : [this.options.scores.bench, this.options.scores.damage.playerBench];
            const pokemonScore = this.getPokemonScoreBy(pokemonScores, cardList);
            pokemonScoreSum += pokemonScore;
            score += multipier * pokemonScore * cardList.damage;
        });
        opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
            const [pokemonScores, multipier] = target.slot === game_1.SlotType.ACTIVE
                ? [this.options.scores.active, this.options.scores.damage.opponentActive]
                : [this.options.scores.bench, this.options.scores.damage.opponentBench];
            const pokemonScore = this.getPokemonScoreBy(pokemonScores, cardList);
            pokemonScoreSum += pokemonScore;
            score += multipier * pokemonScore * cardList.damage;
        });
        score = Math.round(score / pokemonScoreSum);
        return score;
    }
}
exports.DamageScore = DamageScore;
