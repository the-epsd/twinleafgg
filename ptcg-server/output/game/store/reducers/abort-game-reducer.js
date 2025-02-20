"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abortGameReducer = void 0;
const state_1 = require("../state/state");
const game_message_1 = require("../../game-message");
const abort_game_action_1 = require("../actions/abort-game-action");
const check_effect_1 = require("../effect-reducers/check-effect");
function abortGameReducer(store, state, action) {
    // Early exit for players leaving before setup
    if ((state.phase === state_1.GamePhase.WAITING_FOR_PLAYERS || state.phase === state_1.GamePhase.SETUP) && action instanceof abort_game_action_1.AbortGameAction) {
        store.log(state, game_message_1.GameLog.LOG_GAME_FINISHED_BEFORE_STARTED);
        // Mark the game as finished
        state.phase = state_1.GamePhase.FINISHED;
        state.winner = state_1.GameWinner.NONE;
        // Mark all prompts as resolved
        state.prompts.forEach(prompt => {
            prompt.result = null; // Resolve all prompts
        });
        // Optionally, disconnect player sockets here if applicable
        return state; // Early exit
    }
    if (state.phase !== state_1.GamePhase.FINISHED && action instanceof abort_game_action_1.AbortGameAction) {
        const culprit = state.players.find(p => p.id === action.culpritId);
        if (culprit === undefined) {
            return state;
        }
        // Mark all prompts as resolved
        state.prompts.forEach(prompt => {
            if (prompt.result === undefined) {
                prompt.result = null;
            }
        });
        // Explain why game was aborted
        switch (action.reason) {
            case abort_game_action_1.AbortGameReason.TIME_ELAPSED:
                store.log(state, game_message_1.GameLog.LOG_TIME_ELAPSED, { name: culprit.name });
                break;
            case abort_game_action_1.AbortGameReason.ILLEGAL_MOVES:
                store.log(state, game_message_1.GameLog.LOG_BANNED_BY_ARBITER, { name: culprit.name });
                break;
            case abort_game_action_1.AbortGameReason.DISCONNECTED:
                store.log(state, game_message_1.GameLog.LOG_PLAYER_LEFT_THE_GAME, { name: culprit.name });
                break;
        }
        // The player that left loses
        const winner = culprit === state.players[0]
            ? state_1.GameWinner.PLAYER_2
            : state_1.GameWinner.PLAYER_1;
        state = check_effect_1.endGame(store, state, winner);
        return state;
    }
    return state;
}
exports.abortGameReducer = abortGameReducer;
