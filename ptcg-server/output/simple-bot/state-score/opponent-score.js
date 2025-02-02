"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpponentScore = void 0;
const game_1 = require("../../game");
const score_1 = require("./score");
class OpponentScore extends score_1.SimpleScore {
    getScore(state, playerId) {
        const player = this.getPlayer(state, playerId);
        const opponent = game_1.StateUtils.getOpponent(state, player);
        const scores = this.options.scores.opponent;
        let score = 0;
        // for each card in the opponents deck
        score += scores.deck * opponent.deck.cards.length;
        // for each card in the opponents hand
        score += scores.hand * opponent.hand.cards.length;
        // bonus if opponent's bench is empty
        const isBenchEmpty = opponent.bench.every(b => b.cards.length === 0);
        if (isBenchEmpty) {
            score += scores.emptyBench;
        }
        // Opponent's active has no attached energy
        const noActiveEnergy = opponent.active.cards.every(c => !(c instanceof game_1.EnergyCard));
        if (noActiveEnergy) {
            score += scores.noActiveEnergy;
        }
        opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
            const energies = cardList.cards.filter(c => c instanceof game_1.EnergyCard);
            score += scores.energy * energies.length;
            score += scores.board * cardList.cards.length;
        });
        return score;
    }
}
exports.OpponentScore = OpponentScore;
