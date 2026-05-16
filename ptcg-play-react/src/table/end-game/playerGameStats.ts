import type { Card, State } from 'ptcg-server';

/** Per-player match result statistics. */
export interface PlayerGameStats {
  prizesTakenCount: number;
  totalDamageDealt: number;
  topPokemon: {
    card: Card;
    totalDamage: number;
  } | null;
}

export function isValidPlayerGameStats(stats: unknown): stats is PlayerGameStats {
  if (!stats || typeof stats !== 'object') {
    return false;
  }
  const s = stats as Record<string, unknown>;
  if (typeof s.prizesTakenCount !== 'number' || typeof s.totalDamageDealt !== 'number') {
    return false;
  }
  const tp = s.topPokemon;
  if (tp === null) {
    return true;
  }
  if (!tp || typeof tp !== 'object') {
    return false;
  }
  const t = tp as Record<string, unknown>;
  return !!(t.card && typeof t.totalDamage === 'number');
}

export function extractEnhancedPlayerStatsFromState(state: State): PlayerGameStats[] | undefined {
  if (!state?.players) {
    return undefined;
  }
  try {
    return state.players.map((player) => {
      const gameStats = (player as { gameStats?: unknown }).gameStats;
      if (gameStats && isValidPlayerGameStats(gameStats)) {
        return {
          prizesTakenCount: gameStats.prizesTakenCount,
          totalDamageDealt: gameStats.totalDamageDealt,
          topPokemon: gameStats.topPokemon,
        };
      }
      return {
        prizesTakenCount: 0,
        totalDamageDealt: 0,
        topPokemon: null,
      };
    });
  } catch {
    return undefined;
  }
}
