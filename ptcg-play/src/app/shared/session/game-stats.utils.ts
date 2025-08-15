import { Card } from 'ptcg-server';
import { PlayerGameStats, EnhancedPokemonStats, LocalGameState } from './session.interface';

/**
 * Type guard to validate PlayerGameStats structure
 */
export function isValidPlayerGameStats(stats: any): stats is PlayerGameStats {
  return (
    stats &&
    typeof stats === 'object' &&
    typeof stats.prizesTakenCount === 'number' &&
    typeof stats.totalDamageDealt === 'number' &&
    (stats.topPokemon === null || (
      stats.topPokemon &&
      typeof stats.topPokemon === 'object' &&
      stats.topPokemon.card &&
      typeof stats.topPokemon.totalDamage === 'number'
    ))
  );
}

/**
 * Type guard to validate EnhancedPokemonStats structure
 */
export function isValidEnhancedPokemonStats(stats: any): stats is EnhancedPokemonStats {
  return (
    stats &&
    typeof stats === 'object' &&
    stats.card &&
    typeof stats.totalDamage === 'number' &&
    typeof stats.evolutionLevel === 'number'
  );
}

/**
 * Safely extract player game statistics from LocalGameState
 */
export function getPlayerGameStats(gameState: LocalGameState, playerIndex: number): PlayerGameStats | null {
  if (!gameState.enhancedPlayerStats || !Array.isArray(gameState.enhancedPlayerStats)) {
    return null;
  }

  const stats = gameState.enhancedPlayerStats[playerIndex];
  return isValidPlayerGameStats(stats) ? stats : null;
}

/**
 * Safely extract top Pokemon statistics for a player
 */
export function getTopPokemonStats(gameState: LocalGameState, playerIndex: number): { card: Card; totalDamage: number } | null {
  const playerStats = getPlayerGameStats(gameState, playerIndex);
  return playerStats?.topPokemon || null;
}

/**
 * Create default PlayerGameStats when no data is available
 */
export function createDefaultPlayerGameStats(): PlayerGameStats {
  return {
    prizesTakenCount: 0,
    totalDamageDealt: 0,
    topPokemon: null
  };
}

/**
 * Validate and sanitize player game statistics array
 */
export function sanitizePlayerGameStats(stats: any[]): PlayerGameStats[] {
  if (!Array.isArray(stats)) {
    return [];
  }

  return stats.map(stat =>
    isValidPlayerGameStats(stat) ? stat : createDefaultPlayerGameStats()
  );
}