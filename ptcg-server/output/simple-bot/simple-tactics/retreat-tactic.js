"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetreatTactic = void 0;
const game_1 = require("../../game");
const simple_tactics_1 = require("./simple-tactics");
class RetreatTactic extends simple_tactics_1.SimpleTactic {
    useTactic(state, player) {
        if (player.retreatedTurn === state.turn) {
            return;
        }
        let bestScore = this.getStateScore(state, player.id);
        let retreatAction;
        player.bench.forEach((bench, index) => {
            if (bench.cards.length === 0) {
                return;
            }
            const action = new game_1.RetreatAction(player.id, index);
            const score = this.evaluateAction(state, player.id, action);
            if (score !== undefined && bestScore < score) {
                bestScore = score;
                retreatAction = action;
            }
        });
        return retreatAction;
    }
}
exports.RetreatTactic = RetreatTactic;
