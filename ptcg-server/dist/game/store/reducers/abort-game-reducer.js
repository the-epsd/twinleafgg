import { GamePhase, GameWinner } from '../state/state';
import { GameLog } from '../../game-message';
import { AbortGameAction, AbortGameReason } from '../actions/abort-game-action';
import { endGame } from '../effect-reducers/check-effect';
export function abortGameReducer(store, state, action) {
    if (state.phase !== GamePhase.FINISHED && action instanceof AbortGameAction) {
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
            case AbortGameReason.TIME_ELAPSED:
                store.log(state, GameLog.LOG_TIME_ELAPSED, { name: culprit.name });
                break;
            case AbortGameReason.ILLEGAL_MOVES:
                store.log(state, GameLog.LOG_BANNED_BY_ARBITER, { name: culprit.name });
                break;
            case AbortGameReason.DISCONNECTED:
                store.log(state, GameLog.LOG_PLAYER_LEFT_THE_GAME, { name: culprit.name });
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
            ? GameWinner.PLAYER_2
            : GameWinner.PLAYER_1;
        state = endGame(store, state, winner);
        return state;
    }
    return state;
}
