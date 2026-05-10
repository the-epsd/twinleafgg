import { State } from '../store/state/state';

/** First unresolved prompt's player, else active turn player (same rule client + server). */
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
