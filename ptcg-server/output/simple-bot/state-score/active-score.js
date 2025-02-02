"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveScore = void 0;
const score_1 = require("./score");
class ActiveScore extends score_1.SimpleScore {
    getScore(state, playerId) {
        const player = this.getPlayer(state, playerId);
        return this.getPokemonScoreBy(this.options.scores.active, player.active);
    }
}
exports.ActiveScore = ActiveScore;
