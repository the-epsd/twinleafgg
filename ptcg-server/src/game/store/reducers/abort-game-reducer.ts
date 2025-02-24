import { Action } from '../actions/action';
import { State, GamePhase, GameWinner } from '../state/state';
import { GameLog } from '../../game-message';
import { StoreLike } from '../store-like';
import { AbortGameAction, AbortGameReason } from '../actions/abort-game-action';
import { endGame } from '../effect-reducers/check-effect';


export function abortGameReducer(store: StoreLike, state: State, action: Action): State {

  // Early exit for players leaving before setup
  if ((state.phase === GamePhase.WAITING_FOR_PLAYERS || state.phase === GamePhase.SETUP) && action instanceof AbortGameAction) {
    store.log(state, GameLog.LOG_GAME_FINISHED_BEFORE_STARTED);

    // Mark the game as finished
    state.phase = GamePhase.FINISHED;
    state.winner = GameWinner.NONE;

    // Mark all prompts as resolved
    state.prompts.forEach(prompt => {
      prompt.result = null; // Resolve all prompts
    });

    // Optionally, disconnect player sockets here if applicable

    return state; // Early exit
  }

  if (state.phase !== GamePhase.FINISHED && action instanceof AbortGameAction) {
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

    // The player that left loses
    const winner = culprit === state.players[0]
      ? GameWinner.PLAYER_2
      : GameWinner.PLAYER_1;
    state = endGame(store, state, winner);

    return state;
  }
  return state;
}