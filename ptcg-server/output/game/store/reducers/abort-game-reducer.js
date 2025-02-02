"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abortGameReducer = void 0;
const state_1 = require("../state/state");
const game_message_1 = require("../../game-message");
const abort_game_action_1 = require("../actions/abort-game-action");
const check_effect_1 = require("../effect-reducers/check-effect");
function abortGameReducer(store, state, action) {
    if (state.phase !== state_1.GamePhase.FINISHED && action instanceof abort_game_action_1.AbortGameAction) {
        const culprit = state.players.find(p => p.id === action.culpritId);
        if (culprit === undefined) {
            return state;
        }
        // Mark all prompts as resolved, so they won't mess with our state anymore.
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
        //     // Game has not started, no winner
        //     if (state.phase === GamePhase.WAITING_FOR_PLAYERS || state.phase === GamePhase.SETUP) {
        //       store.log(state, GameLog.LOG_GAME_FINISHED_BEFORE_STARTED);
        //       state.phase = GamePhase.FINISHED;
        //       state.winner = GameWinner.NONE;
        //       return state;
        //     }
        //     // Let's decide who wins.
        //     const opponent = StateUtils.getOpponent(state, culprit);
        //     const culpritPrizeLeft = culprit.getPrizeLeft();
        //     const opponentPrizeLeft = opponent.getPrizeLeft();
        //     // It was first turn, no winner
        //     if (state.turn <= 2 && culpritPrizeLeft === opponentPrizeLeft) {
        //       state = endGame(store, state, GameWinner.NONE);
        //       return state;
        //     }
        //     // Opponent has same or less prizes, he wins
        //     if (opponentPrizeLeft <= culpritPrizeLeft) {
        //       const winner = opponent === state.players[0]
        //         ? GameWinner.PLAYER_1
        //         : GameWinner.PLAYER_2;
        //       state = endGame(store, state, winner);
        //       return state;
        //     }
        //     // Otherwise it's a draw
        //     state = endGame(store, state, GameWinner.DRAW);
        //   }
        //   return state;
        // }
        // Game has not started, no winner
        // if (state.phase === GamePhase.WAITING_FOR_PLAYERS || state.phase === GamePhase.SETUP) {
        //   store.log(state, GameLog.LOG_GAME_FINISHED_BEFORE_STARTED);
        //   state.phase = GamePhase.FINISHED;
        //   state.winner = GameWinner.NONE;
        //   return state;
        // }
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
