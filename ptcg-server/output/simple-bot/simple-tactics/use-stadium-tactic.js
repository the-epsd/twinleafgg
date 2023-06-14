"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseStadiumTactic = void 0;
const game_1 = require("../../game");
const simple_tactics_1 = require("./simple-tactics");
class UseStadiumTactic extends simple_tactics_1.SimpleTactic {
    useTactic(state, player) {
        if (player.stadiumUsedTurn >= state.turn) {
            return;
        }
        if (game_1.StateUtils.getStadiumCard(state) === undefined) {
            return;
        }
        const passTurnScore = this.options.scores.tactics.passTurn;
        const currentScore = this.getStateScore(state, player.id);
        const action = new game_1.UseStadiumAction(player.id);
        const score = this.evaluateAction(state, player.id, action, passTurnScore);
        if (score !== undefined && currentScore < score) {
            return action;
        }
    }
}
exports.UseStadiumTactic = UseStadiumTactic;
