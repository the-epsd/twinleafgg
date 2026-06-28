import { GamePhase, type GameInfo } from 'ptcg-server';

/** True when a game should appear in spectate / active-game lists. */
export function isActiveListGameInfo(game: GameInfo): boolean {
  return game.phase !== GamePhase.FINISHED && game.players.length >= 2;
}
