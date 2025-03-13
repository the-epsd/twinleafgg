"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolsScore = void 0;
const game_1 = require("../../game");
const score_1 = require("./score");
class ToolsScore extends score_1.SimpleScore {
    getScore(state, playerId) {
        const player = this.getPlayer(state, playerId);
        const scores = this.options.scores.tools;
        let score = 0;
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            if (cardList.tool === undefined) {
                return;
            }
            const activeScore = cardList === player.active ? scores.active : 0;
            const hpScore = (card.hp - cardList.damage) * scores.hpLeft;
            if (activeScore + hpScore >= scores.minScore) {
                score += activeScore + hpScore;
            }
        });
        return score;
    }
}
exports.ToolsScore = ToolsScore;
