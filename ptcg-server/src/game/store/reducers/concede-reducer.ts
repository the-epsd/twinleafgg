import { ConcedeAction } from '../actions/concede-action';
import { State, GamePhase, GameWinner } from '../state/state';
import { GameLog } from '../../game-message';
import { StoreLike } from '../store-like';
import { endGame } from '../effect-reducers/check-effect';

export function concedeReducer(store: StoreLike, state: State, action: ConcedeAction): State {
  if (state.phase === GamePhase.FINISHED) {
    return state;
  }

  // Find the player who is conceding
  const playerIndex = state.players.findIndex(p => p.id === action.playerId);
  if (playerIndex === -1) {
    return state;
  }

  const concedingPlayer = state.players[playerIndex];

  // Log the concession
  store.log(state, GameLog.LOG_PLAYER_CONCEDED, { name: concedingPlayer.name });

  // The other player wins
  const winner = playerIndex === 0 ? GameWinner.PLAYER_2 : GameWinner.PLAYER_1;

  // End the game
  state = endGame(store, state, winner);

  return state;
}