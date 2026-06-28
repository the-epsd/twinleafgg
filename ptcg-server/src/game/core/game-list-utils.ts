import { GamePhase } from '../store/state/state';
import type { Game } from './game';

/** True when a live game should appear in spectate / active-game lists. */
export function isActiveListGame(game: Game): boolean {
  const state = game.state;
  return state.phase !== GamePhase.FINISHED && state.players.length >= 2;
}
