"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialConditionsScore = void 0;
const game_1 = require("../../game");
const score_1 = require("./score");
const card_types_1 = require("../../game/store/card/card-types");
class SpecialConditionsScore extends score_1.SimpleScore {
    getScore(state, playerId) {
        const player = this.getPlayer(state, playerId);
        const opponent = game_1.StateUtils.getOpponent(state, player);
        let score = 0;
        score += this.getScoreForPlayer(player);
        score -= this.getScoreForPlayer(opponent);
        return score;
    }
    getScoreForPlayer(player) {
        const scores = this.options.scores.specialConditions;
        let score = 0;
        player.active.specialConditions.forEach(condition => {
            switch (condition) {
                case card_types_1.SpecialCondition.PARALYZED:
                    score += scores.paralyzed;
                    break;
                case card_types_1.SpecialCondition.CONFUSED:
                    score += scores.confused;
                    break;
                case card_types_1.SpecialCondition.ASLEEP:
                    score += scores.asleep;
                    break;
                case card_types_1.SpecialCondition.POISONED:
                    score += scores.poisoned;
                    break;
                case card_types_1.SpecialCondition.BURNED:
                    score += scores.confused;
                    break;
            }
        });
        return score;
    }
}
exports.SpecialConditionsScore = SpecialConditionsScore;
