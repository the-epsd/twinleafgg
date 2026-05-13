import type { State } from 'ptcg-server';

/** Mirrors ptcg-server `selfPlayFocusPlayerId` (kept local so Vite prebundle always resolves). */
export function selfPlayFocusPlayerId(state: State): number {
  const pending = state.prompts.filter((p) => p.result === undefined);
  if (pending.length > 0) {
    return pending[0].playerId;
  }
  const pl = state.players[state.activePlayer];
  if (pl) {
    return pl.id;
  }
  return state.players[0]?.id ?? 0;
}
